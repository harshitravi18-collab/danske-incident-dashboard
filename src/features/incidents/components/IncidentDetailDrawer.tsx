import { Drawer, Button } from "antd";
import type { User } from "../../../api/types";
import { useIncidentQuery } from "../hooks";
import { IncidentEditPanel } from "./IncidentEditPanel";
import { IncidentReadOnlyDetails } from "./IncidentReadOnlyDetails";
import { useTranslation } from "react-i18next";

type Props = {
  incidentId?: string;
  isOpen: boolean;
  onClose: () => void;
  usersById: Record<string, string>;
  users: User[];
};

export function IncidentDetailDrawer({
  incidentId,
  isOpen,
  onClose,
  usersById,
  users,
}: Props) {
  const { t } = useTranslation();
  const q = useIncidentQuery(incidentId);

  return (
    <Drawer
      title={t("drawer.title")}
      open={isOpen}
      onClose={onClose}
      width={520}
      destroyOnClose
    >
      {q.isLoading ? (
        <div>{t("drawer.loading")}</div>
      ) : q.isError ? (
        <div>
          <div style={{ marginBottom: 12 }}>{t("drawer.loadError")}</div>
          <Button onClick={() => q.refetch()}>{t("common.retry")}</Button>
        </div>
      ) : q.data ? (
        <>
          <IncidentEditPanel incident={q.data} users={users} />
          <IncidentReadOnlyDetails incident={q.data} usersById={usersById} />
        </>
      ) : null}
    </Drawer>
  );
}
