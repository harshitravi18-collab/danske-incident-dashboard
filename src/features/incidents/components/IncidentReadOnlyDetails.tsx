import { Descriptions, List, Tag } from "antd";
import type { Incident, IncidentStatus } from "@api/types";
import { useTranslation } from "react-i18next";

type Props = {
  incident: Incident;
  usersById: Record<string, string>;
};

const STATUS_COLOR: Record<IncidentStatus, string> = {
  Open: "red",
  "In Progress": "gold",
  Resolved: "green",
};

const SEVERITY_COLOR: Record<Incident["severity"], string> = {
  Low: "blue",
  Medium: "gold",
  High: "orange",
  Critical: "red",
};

export function IncidentReadOnlyDetails({ incident, usersById }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label={t("table.title")}>
          {incident.title}
        </Descriptions.Item>

        <Descriptions.Item label={t("drawer.description")}>
          <div style={{ whiteSpace: "pre-wrap" }}>{incident.description}</div>
        </Descriptions.Item>

        <Descriptions.Item label={t("table.status")}>
          <Tag color={STATUS_COLOR[incident.status]}>
            {t(`status.${incident.status}`, incident.status)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={t("table.severity")}>
          <Tag color={SEVERITY_COLOR[incident.severity]}>
            {t(`severity.${incident.severity}`, incident.severity)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={t("table.assignee")}>
          {incident.assigneeId
            ? (usersById[incident.assigneeId] ?? t("drawer.unknownUser"))
            : t("common.unassigned")}
        </Descriptions.Item>

        <Descriptions.Item label={t("drawer.created")}>
          {new Date(incident.createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>
          {t("drawer.statusHistory")}
        </div>

        <List
          size="small"
          dataSource={incident.statusHistory ?? []}
          locale={{ emptyText: t("drawer.noHistory") }}
          renderItem={(h) => (
            <List.Item>
              <Tag>{t(`status.${h.status}`, h.status)}</Tag>
              <span style={{ marginLeft: 8 }}>
                {new Date(h.changedAt).toLocaleString()}
              </span>
              {h.changedBy ? (
                <span style={{ marginLeft: 8 }}>
                  {t("drawer.changedBy")}{" "}
                  {usersById[h.changedBy] ?? t("drawer.unknownUser")}
                </span>
              ) : null}
            </List.Item>
          )}
        />
      </div>
    </>
  );
}
