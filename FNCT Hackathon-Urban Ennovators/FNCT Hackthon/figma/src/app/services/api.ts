/// <reference types="vite/client" />

export interface ApiStop {
  id: string;
  binId: string;
  address: string;
  volume: number;
  status: "completed" | "in-progress" | "pending" | "anomaly";
  fillLevel: number;
  time?: string;
}

export interface ApiTruck {
  id: string;
  driver: string;
  capacity: number;
  binsCollected: number;
  binsTotal: number;
  kmTraveled: number;
  eta: string;
  status: "active" | "returning" | "at-depot";
  route: ApiStop[];
  color: string;
  lat: number;
  lng: number;
}

export interface ApiBin {
  id: string;
  zone: string;
  type: "240L" | "660L" | "1100L";
  fillLevel: number;
  volume: number;
  lastReading: string;
  sensorStatus: "ok" | "defective";
  status: "collected" | "full" | "waiting" | "anomaly";
  lat: number;
  lng: number;
  address: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export function getPlanningToday() {
  return fetchJson<{ date: string; plan: any; trucks: ApiTruck[]; bins: ApiBin[] }>("/planning/today");
}

export function generatePlanning() {
  return fetchJson<{ success: boolean; message: string; date: string; plan: any }>("/planning/generate", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function getBinsToday() {
  return fetchJson<{ date: string; bins: ApiBin[] }>("/bins/today");
}

export function getTrucksLive() {
  return fetchJson<{ date: string; trucks: ApiTruck[] }>("/trucks/live");
}

export function postDriverEvent(event: {
  truckId: string;
  binId?: string;
  eventType: "collecte" | "incident" | "capacity_alert";
  payload?: Record<string, unknown>;
}) {
  return fetchJson<{ success: boolean; event: any }>("/driver/events", {
    method: "POST",
    body: JSON.stringify(event),
  });
}
