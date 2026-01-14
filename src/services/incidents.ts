import type {
  CreateIncidentInput,
  Incident,
  UpdateIncidentInput,
} from "../api/types";
import { fetchJson } from "./http";

export function listIncidents(signal?: AbortSignal): Promise<Incident[]> {
  return fetchJson<Incident[]>("/api/incidents", { signal });
}

export function getIncident(
  id: string,
  signal?: AbortSignal,
): Promise<Incident> {
  return fetchJson<Incident>(`/api/incidents/${encodeURIComponent(id)}`, {
    signal,
  });
}

export function createIncident(input: CreateIncidentInput): Promise<Incident> {
  return fetchJson<Incident>("/api/incidents", {
    method: "POST",
    body: input,
  });
}

export function updateIncident(
  id: string,
  input: UpdateIncidentInput,
): Promise<Incident> {
  return fetchJson<Incident>(`/api/incidents/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
  });
}
