import { Alert, Button, Select, Space, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { Incident, IncidentStatus, User } from "../../../api/types";
import { useUpdateIncidentMutation } from "../hooks";
import { useTranslation } from "react-i18next";

type Props = {
  incident: Incident;
  users: User[];
};

export function IncidentEditPanel({ incident, users }: Props) {
  const { t } = useTranslation();
  const update = useUpdateIncidentMutation();
  const [msgApi, contextHolder] = message.useMessage();

  const [status, setStatus] = useState<IncidentStatus>(incident.status);
  const [assigneeId, setAssigneeId] = useState<string | null>(
    incident.assigneeId ?? null,
  );

  useEffect(() => {
    setStatus(incident.status);
    setAssigneeId(incident.assigneeId ?? null);
  }, [incident.id, incident.status, incident.assigneeId]);

  const saving = update.isPending;

  const hasChanges =
    status !== incident.status ||
    (assigneeId ?? null) !== (incident.assigneeId ?? null);

  const statusOptions = useMemo(() => {
    const values: IncidentStatus[] = ["Open", "In Progress", "Resolved"];
    return values.map((s) => ({ value: s, label: t(`status.${s}`, s) }));
  }, [t]);

  const assigneeOptions = useMemo(
    () => [
      { value: "unassigned", label: t("common.unassigned") },
      ...users.map((u) => ({ value: u.id, label: u.name })),
    ],
    [users, t],
  );

  async function onSave() {
    try {
      await update.mutateAsync({
        id: incident.id,
        input: { status, assigneeId },
      });
      msgApi.success(t("common.saved", "Saved"));
    } catch {
      // error shown below
    }
  }

  function onReset() {
    setStatus(incident.status);
    setAssigneeId(incident.assigneeId ?? null);
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {contextHolder}

      <Space direction="vertical" style={{ width: "100%" }} size={10}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
            {t("drawer.updateStatus")}
          </div>
          <Select
            value={status}
            onChange={(v) => setStatus(v)}
            options={statusOptions}
            style={{ width: "100%" }}
            disabled={saving}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
            {t("drawer.updateAssignee")}
          </div>
          <Select
            value={assigneeId ?? "unassigned"}
            onChange={(v) => setAssigneeId(v === "unassigned" ? null : v)}
            options={assigneeOptions}
            style={{ width: "100%" }}
            disabled={saving}
            loading={!users.length}
            showSearch
            optionFilterProp="label"
          />
        </div>

        {update.isError ? (
          <Alert
            type="error"
            showIcon
            message={t("drawer.updateError")}
            action={
              <Button size="small" onClick={onSave}>
                {t("common.retry")}
              </Button>
            }
          />
        ) : null}

        <Space>
          <Button
            type="primary"
            onClick={onSave}
            disabled={!hasChanges || saving}
            loading={saving}
          >
            {t("common.save")}
          </Button>
          <Button onClick={onReset} disabled={!hasChanges || saving}>
            {t("common.reset", "Reset")}
          </Button>
        </Space>
      </Space>
    </div>
  );
}
