import { Outlet, useNavigate, useParams } from "react-router-dom";
import type { Incident } from "../../api/types";
import { useIncidentsQuery, useUsersQuery } from "./hooks";
import {
  IncidentFiltersBar,
  type IncidentFilters,
} from "./components/IncidentFiltersBar";
import { IncidentTable } from "./components/IncidentTable";
import { IncidentDetailDrawer } from "./components/IncidentDetailDrawer";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { CreateIncidentModal } from "./components/CreateIncidentModal";

const SEVERITY_RANK: Record<Incident["severity"], number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

export type SortKey =
  | "createdAt_desc"
  | "createdAt_asc"
  | "title_asc"
  | "severity_desc"
  | "status_asc";

function applyFiltersAndSort(
  incidents: Incident[],
  filters: IncidentFilters,
  sortKey: SortKey,
): Incident[] {
  const q = filters.query.trim().toLowerCase();

  let out = incidents.filter((i) => {
    if (q && !i.title.toLowerCase().includes(q)) return false;
    if (filters.status !== "all" && i.status !== filters.status) return false;
    if (filters.severity !== "all" && i.severity !== filters.severity)
      return false;
    if (filters.assigneeId !== "all") {
      const a = i.assigneeId ?? "unassigned";
      if (filters.assigneeId === "unassigned") return a === "unassigned";
      return a === filters.assigneeId;
    }
    return true;
  });

  const by = {
    createdAt_desc: (a: Incident, b: Incident) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    createdAt_asc: (a: Incident, b: Incident) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    title_asc: (a: Incident, b: Incident) => a.title.localeCompare(b.title),
    severity_desc: (a: Incident, b: Incident) =>
      SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity],
    status_asc: (a: Incident, b: Incident) => a.status.localeCompare(b.status),
  }[sortKey];

  out = [...out].sort(by);
  return out;
}

export function IncidentsPage() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { incidentId } = useParams();

  const incidentsQ = useIncidentsQuery();
  const usersQ = useUsersQuery();

  const [filters, setFilters] = useState<IncidentFilters>({
    query: "",
    status: "all",
    severity: "all",
    assigneeId: "all",
  });

  const [sortKey, setSortKey] = useState<SortKey>("createdAt_desc");

  const filtered = useMemo(() => {
    return applyFiltersAndSort(incidentsQ.data ?? [], filters, sortKey);
  }, [incidentsQ.data, filters, sortKey]);

  const usersById = useMemo(() => {
    return Object.fromEntries((usersQ.data ?? []).map((u) => [u.id, u.name]));
  }, [usersQ.data]);

  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <h1 className="h1">{t("app.title")}</h1>
          <p className="muted">{t("app.subtitle")}</p>
        </div>
        <div className="headerRight">
          <Button type="primary" onClick={() => setCreateOpen(true)}>
            {t("create.open")}
          </Button>
        </div>
      </header>

      <section className="filtersSection">
        <IncidentFiltersBar
          users={usersQ.data ?? []}
          value={filters}
          onChange={setFilters}
          sortKey={sortKey}
          onSortChange={setSortKey}
          isUsersLoading={usersQ.isLoading}
        />
      </section>

      <section className="resultsSection">
        {incidentsQ.isLoading ? (
          <div className="state">{t("common.loading")}</div>
        ) : incidentsQ.isError ? (
          <div className="state error">
            <div>{t("common.error")}</div>
            <button className="btn" onClick={() => incidentsQ.refetch()}>
              {t("common.retry")}
            </button>
          </div>
        ) : (
          <IncidentTable
            incidents={filtered}
            usersById={usersById}
            onSelect={(id) => navigate(`/incidents/${id}`)}
          />
        )}
      </section>

      <CreateIncidentModal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        users={usersQ.data ?? []}
        onCreated={(id) => navigate(`/incidents/${id}`)}
      />

      {/* Drawer route */}
      <Outlet />
      <IncidentDetailDrawer
        incidentId={incidentId}
        isOpen={Boolean(incidentId)}
        onClose={() => navigate("/incidents")}
        usersById={usersById}
        users={usersQ.data ?? []}
      />
    </div>
  );
}
