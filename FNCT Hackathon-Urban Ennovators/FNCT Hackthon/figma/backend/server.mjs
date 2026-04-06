import express from "express";
import cors from "cors";
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json());

const FIGMA_ROOT = process.cwd();
const DATA_ROOT = path.resolve(FIGMA_ROOT, "..", "data");
const EVENTS_PATH = path.join(FIGMA_ROOT, "backend", "events.json");

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, "utf-8");
  return parse(text, { columns: true, skip_empty_lines: true, relax_quotes: true });
}

function ensureEventsStore() {
  if (!fs.existsSync(EVENTS_PATH)) {
    fs.writeFileSync(EVENTS_PATH, JSON.stringify({ events: [] }, null, 2), "utf-8");
  }
}

function computeEtaFromDuration(durationMin) {
  const startMinutes = 7 * 60 + 30;
  const etaMin = startMinutes + Number(durationMin || 0);
  const hh = String(Math.floor(etaMin / 60) % 24).padStart(2, "0");
  const mm = String(etaMin % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getPalette(index) {
  const colors = ["#00E5A0", "#4D9EFF", "#9D4EDD", "#FFD60A", "#06FFA5", "#FF6B35"];
  return colors[index % colors.length];
}

function getDailySensorSnapshot() {
  const rows = readCsv(path.join(DATA_ROOT, "daily_sensor_readings.csv"));
  if (!rows.length) return { date: null, byBin: new Map() };

  const dates = rows.map((r) => String(r.date)).sort();
  const date = dates[dates.length - 1];
  const dayRows = rows.filter((r) => String(r.date) === date);

  const at7 = dayRows.filter((r) => String(r.reading_time) === "07:00:00");
  const selectedRows = at7.length ? at7 : dayRows;

  const byBin = new Map();
  selectedRows.forEach((r) => {
    const prev = byBin.get(r.bin_id);
    if (!prev || String(prev.reading_time) < String(r.reading_time)) {
      byBin.set(r.bin_id, r);
    }
  });

  return { date, byBin };
}

function buildLiveData() {
  const bins = readCsv(path.join(DATA_ROOT, "bins.csv"));
  const trucks = readCsv(path.join(DATA_ROOT, "trucks.csv"));
  const plan = readJson(path.join(DATA_ROOT, "plan_tournee_optimise.json"), null);

  const { date, byBin } = getDailySensorSnapshot();
  const eventsStore = readJson(EVENTS_PATH, { events: [] }) || { events: [] };
  const collectedBinIds = new Set(
    (eventsStore.events || [])
      .filter((e) => e.eventType === "collecte")
      .map((e) => String(e.binId))
  );

  const anomalyBinIds = new Set(
    (eventsStore.events || [])
      .filter((e) => e.eventType === "probleme")
      .map((e) => String(e.binId))
  );

  const binsOut = bins.map((b) => {
    const s = byBin.get(b.bin_id) || {};
    const fillLevel = Number(s.fill_pct ?? 0);
    const sensorStatus = String(s.sensor_status || "OK").toLowerCase() === "ok" ? "ok" : "defective";
    let status = "waiting";
    if (sensorStatus === "defective" || anomalyBinIds.has(String(b.bin_id))) status = "anomaly";
    else if (collectedBinIds.has(String(b.bin_id))) status = "collected";
    else if (fillLevel >= 80) status = "full";

    return {
      id: String(b.bin_id),
      zone: String(b.zone || "N/A"),
      type: String(b.bin_type || "240L"),
      fillLevel,
      volume: Number(s.volume_actual_m3 ?? b.volume_nominal_m3 ?? 0),
      lastReading: String(s.reading_time || "07:00"),
      sensorStatus,
      status,
      lat: Number(s.lat ?? b.lat ?? 0),
      lng: Number(s.lng ?? b.lng ?? 0),
      address: String(b.street || b.zone || "Adresse inconnue"),
    };
  });

  const trucksById = new Map(trucks.map((t) => [String(t.truck_id), t]));
  const tournees = (plan && Array.isArray(plan.tournees)) ? plan.tournees : [];

  const trucksOut = trucks.map((t, idx) => {
    const id = String(t.truck_id);
    const tournee = tournees.find((x) => String(x.camion_id) === id);
    const sequence = Array.isArray(tournee?.sequence) ? tournee.sequence : [];
    const stopsCollecte = sequence.filter((s) => s.type === "collecte");
    const route = stopsCollecte.map((s, sIdx) => {
      const bId = String(s.poubelle_id);
      let rStatus = "pending";
      if (collectedBinIds.has(bId)) rStatus = "completed";
      else if (anomalyBinIds.has(bId)) rStatus = "anomaly";

      return {
        id: `${id}-s${sIdx + 1}`,
        binId: bId,
        address: bId,
        volume: Number(s.volume_a_collecter_m3 || 0),
        status: rStatus,
        fillLevel: Number(s.taux_remplissage_pct || 0),
        time: undefined,
      };
    });

    const firstUncompletedIndex = route.findIndex(r => r.status !== "completed" && r.status !== "anomaly");
    if (firstUncompletedIndex !== -1) {
      route[firstUncompletedIndex].status = "in-progress";
    }

    const binsTotal = Number(tournee?.nombre_arrets || route.length || 0);
    const binsCollected = route.filter((r) => r.status === "completed" || r.status === "anomaly").length;
    
    const maxCapacity = Math.max(Number(t.capacity_max_m3 || 1), 1e-9);
    let totalVolumeCollected = 0;
    route.forEach(r => {
      if (r.status === "completed") {
        totalVolumeCollected += Number(r.volume || 0);
      }
    });
    
    // Add base loaded capacity if we want, but dynamic is better
    const capacityPct = Math.round((totalVolumeCollected / maxCapacity) * 100);

    const first = stopsCollecte[0];
    const lat = Number(first?.position?.lat ?? t.depot_lat ?? 0);
    const lng = Number(first?.position?.lng ?? t.depot_lng ?? 0);

    return {
      id,
      driver: String(t.driver || `Driver ${id}`),
      capacity: Math.max(0, Math.min(100, capacityPct)),
      binsCollected,
      binsTotal,
      kmTraveled: Number(tournee?.distance_totale_km || 0),
      eta: computeEtaFromDuration(tournee?.duree_estimee_min || 0),
      status: binsTotal > 0 ? "active" : "at-depot",
      route,
      color: getPalette(idx),
      lat,
      lng,
    };
  });

  return {
    date: plan?.date || date,
    heure_generation: plan?.heure_generation || "07:00",
    decharge: plan?.decharge || null,
    bins: binsOut,
    trucks: trucksOut,
    plan,
    eventsCount: (eventsStore.events || []).length,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "smartwaste-api", port: PORT });
});

app.get("/api/planning/today", (_req, res) => {
  const live = buildLiveData();
  res.json({
    date: live.date,
    heure_generation: live.heure_generation,
    plan: live.plan,
    trucks: live.trucks,
    bins: live.bins,
  });
});

app.post("/api/planning/generate", (_req, res) => {
    // Reset all driver events when a new plan is generated
    fs.writeFileSync(EVENTS_PATH, JSON.stringify({ events: [] }, null, 2), "utf-8");
    
    const live = buildLiveData();
    res.json({
      success: true,
      message: "Plan charge depuis plan_tournee_optimise.json. Historique réinitialisé.",
    plan: live.plan,
  });
});

app.get("/api/bins/today", (_req, res) => {
  const live = buildLiveData();
  res.json({ date: live.date, bins: live.bins });
});

app.get("/api/trucks/live", (_req, res) => {
  const live = buildLiveData();
  res.json({ date: live.date, trucks: live.trucks });
});

app.post("/api/driver/events", (req, res) => {
  const { truckId, binId, eventType, payload } = req.body || {};
  if (!truckId || !eventType) {
    return res.status(400).json({ success: false, message: "truckId et eventType sont requis" });
  }

  ensureEventsStore();
  const store = readJson(EVENTS_PATH, { events: [] }) || { events: [] };
  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    ts: new Date().toISOString(),
    truckId: String(truckId),
    binId: binId ? String(binId) : null,
    eventType: String(eventType),
    payload: payload || {},
  };
  store.events.push(event);
  fs.writeFileSync(EVENTS_PATH, JSON.stringify(store, null, 2), "utf-8");

  res.json({ success: true, event });
});

app.listen(PORT, () => {
  ensureEventsStore();
  console.log(`SmartWaste API listening on http://localhost:${PORT}`);
});
