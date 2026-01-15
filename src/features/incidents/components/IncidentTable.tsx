import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Incident } from "@api/types";
import { useTranslation } from "react-i18next";

type Props = {
  incidents: Incident[];
  usersById: Record<string, string>;
  onSelect: (id: string) => void;
};
const STATUS_COLOR: Record<Incident["status"], string> = {
  Open: "red",
  "In Progress": "orange",
  Resolved: "green",
};

const SEVERITY_COLOR: Record<Incident["severity"], string> = {
  Low: "blue",
  Medium: "gold",
  High: "orange",
  Critical: "red",
};

export function IncidentTable({ incidents, usersById, onSelect }: Props) {
  const { t } = useTranslation();
  const columns: ColumnsType<Incident> = [
    {
      title: t("table.title"),
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: t("table.status"),
      dataIndex: "status",
      key: "status",
      render: (status: Incident["status"]) => (
        <Tag color={STATUS_COLOR[status]}>{status}</Tag>
      ),
    },
    {
      title: t("table.severity"),
      dataIndex: "severity",
      key: "severity",
      render: (severity: Incident["severity"]) => (
        <Tag color={SEVERITY_COLOR[severity]}>{severity}</Tag>
      ),
    },
    {
      title: t("table.assignee"),
      dataIndex: "assigneeId",
      key: "assigneeId",
      render: (assigneeId: Incident["assigneeId"]) =>
        assigneeId ? (usersById[assigneeId] ?? "Unknown user") : "Unassigned",
    },
    {
      title: t("table.created"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
  ];

  return (
    <Table<Incident>
      rowKey="id"
      columns={columns}
      dataSource={incidents}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      onRow={(record) => ({
        onClick: () => onSelect(record.id),
      })}
    />
  );
}
