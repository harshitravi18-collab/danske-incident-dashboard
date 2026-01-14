import type { User } from "../api/types";
import { fetchJson } from "./http";

export function listUsers(signal?: AbortSignal): Promise<User[]> {
  return fetchJson<User[]>("/api/users", { signal });
}
