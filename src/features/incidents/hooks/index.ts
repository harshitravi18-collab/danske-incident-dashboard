import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateIncidentInput, UpdateIncidentInput } from "@api/types";
import {
  createIncident,
  getIncident,
  listIncidents,
  updateIncident,
} from "@services/incidents";
import { listUsers } from "@services/users";

export const qk = {
  incidents: ["incidents"] as const,
  incident: (id: string) => ["incident", id] as const,
  users: ["users"] as const,
};

export function useIncidentsQuery() {
  return useQuery({
    queryKey: qk.incidents,
    queryFn: ({ signal }) => listIncidents(signal),
  });
}

export function useIncidentQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? qk.incident(id) : ["incident", "missing"],
    queryFn: ({ signal }) => getIncident(id!, signal),
    enabled: Boolean(id),
  });
}

export function useUsersQuery() {
  return useQuery({
    queryKey: qk.users,
    queryFn: ({ signal }) => listUsers(signal),
  });
}

export function useCreateIncidentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateIncidentInput) => createIncident(input),
    onSuccess: async (created) => {
      // refresh list
      await qc.invalidateQueries({ queryKey: qk.incidents });
      // prime detail cache
      qc.setQueryData(qk.incident(created.id), created);
    },
  });
}

export function useUpdateIncidentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIncidentInput }) =>
      updateIncident(id, input),
    onSuccess: async (updated) => {
      qc.setQueryData(qk.incident(updated.id), updated);
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.incidents }),
        qc.invalidateQueries({ queryKey: qk.incident(updated.id) }),
      ]);
    },
  });
}
