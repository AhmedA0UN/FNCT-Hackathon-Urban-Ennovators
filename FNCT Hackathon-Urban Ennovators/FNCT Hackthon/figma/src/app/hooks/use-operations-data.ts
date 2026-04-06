import { useCallback, useEffect, useMemo, useState } from "react";
import { mockBins, mockTrucks, Bin, Truck } from "../data/mock-data";
import { generatePlanning, getBinsToday, getPlanningToday, getTrucksLive, postDriverEvent } from "../services/api";

interface OpsState {
  bins: Bin[];
  trucks: Truck[];
  date: string;
  loading: boolean;
  error: string | null;
}

export function useOperationsData() {
  const [state, setState] = useState<OpsState>({
    bins: mockBins,
    trucks: mockTrucks,
    date: new Date().toISOString().slice(0, 10),
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [planning, binsRes, trucksRes] = await Promise.all([
        getPlanningToday(),
        getBinsToday(),
        getTrucksLive(),
      ]);

      setState({
        bins: (binsRes.bins || planning.bins || mockBins) as Bin[],
        trucks: (trucksRes.trucks || planning.trucks || mockTrucks) as Truck[],
        date: planning.date || binsRes.date || trucksRes.date || new Date().toISOString().slice(0, 10),
        loading: false,
        error: null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue API";
      setState({
        bins: mockBins,
        trucks: mockTrucks,
        date: new Date().toISOString().slice(0, 10),
        loading: false,
        error: `${msg} — fallback mock actif`,
      });
    }
  }, []);

  const generateRoutes = useCallback(async () => {
    await generatePlanning();
    await refresh();
  }, [refresh]);

  const markProblem = useCallback(async (truckId: string, binId: string) => {
    try {
      await postDriverEvent({ truckId, binId, eventType: 'probleme' });
      await refresh();
    } catch {}
  }, [refresh]);

  const markCollected = useCallback(async (truckId: string, binId: string) => {
    try {
      await postDriverEvent({ truckId, binId, eventType: "collecte" });
      await refresh();
    } catch {
      // Non bloquant: la vue garde l'etat local/fallback
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeTruck = useMemo(() => state.trucks.find((t) => t.status === "active") || state.trucks[0], [state.trucks]);

  return {
    ...state,
    activeTruck,
    refresh,
    generateRoutes,
    markCollected,
    markProblem,
  };
}

