import { Input, Select, Space } from "antd";
import type {
  IncidentStatus,
  IncidentSeverity,
  User,
} from "../../../api/types";
import type { SortKey } from "../IncidentsPage";
import { useTranslation } from "react-i18next";

export type IncidentFilters = {
  query: string;
  status: "all" | IncidentStatus;
  severity: "all" | IncidentSeverity;
  assigneeId: "all" | "unassigned" | string;
};

type Props = {
  users: User[];
  value: IncidentFilters;
  onChange: (next: IncidentFilters) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  isUsersLoading?: boolean;
};

export function IncidentFiltersBar({
  users,
  value,
  onChange,
  sortKey,
  onSortChange,
  isUsersLoading,
}: Props) {
  const { t } = useTranslation();
  return (
    <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
      <Space wrap>
        <Input.Search
          allowClear
          placeholder={t("filters.searchPlaceholder")}
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          style={{ width: 320 }}
        />

        <Select
          value={value.status}
          onChange={(v) => onChange({ ...value, status: v })}
          style={{ width: 160 }}
          options={[
            { value: "all", label: t("filters.allStatuses") },
            { value: "Open", label: t("filters.open") },
            { value: "In Progress", label: t("filters.inProgress") },
            { value: "Resolved", label: t("filters.resolved") },
          ]}
        />

        <Select
          value={value.severity}
          onChange={(v) => onChange({ ...value, severity: v })}
          style={{ width: 160 }}
          options={[
            { value: "all", label: t("filters.allSeverities") },
            { value: "Low", label: t("filters.low") },
            { value: "Medium", label: t("filters.medium") },
            { value: "High", label: t("filters.high") },
            { value: "Critical", label: t("filters.critical") },
          ]}
        />

        <Select
          value={value.assigneeId}
          onChange={(v) => onChange({ ...value, assigneeId: v })}
          style={{ width: 180 }}
          loading={isUsersLoading}
          options={[
            { value: "all", label: t("filters.allAssignees") },
            { value: "unassigned", label: t("filters.unassigned") },
            ...users.map((u) => ({ value: u.id, label: u.name })),
          ]}
        />
      </Space>

      <Select
        value={sortKey}
        onChange={(v) => onSortChange(v)}
        style={{ width: 180 }}
        options={[
          { value: "createdAt_desc", label: t("filters.createdNewest") },
          { value: "createdAt_asc", label: t("filters.createdOldest") },
          { value: "title_asc", label: t("filters.titleAZ") },
          { value: "severity_desc", label: t("filters.severityHighToLow") },
          { value: "status_asc", label: t("filters.statusAZ") },
        ]}
      />
    </Space>
  );
}
