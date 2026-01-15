import { Modal, Form, Input, Select, Button, Space, Alert } from "antd";
import type { IncidentSeverity, User, CreateIncidentInput } from "@api/types";
import { useCreateIncidentMutation } from "../hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

const schema = z.object({
  title: z.string().trim().min(3, "form.titleMin"),
  description: z.string().trim().min(10, "form.descriptionMin"),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  assigneeId: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  users: User[];
  onCreated?: (id: string) => void;
};

export function CreateIncidentModal({
  open,
  onClose,
  users,
  onCreated,
}: Props) {
  const { t } = useTranslation();
  const create = useCreateIncidentMutation();
  const LABEL_COL_STYLE = { width: 90 };

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      title: "",
      description: "",
      severity: "Medium",
      assigneeId: null,
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);
  // Reset mutation state when modal opens
  useEffect(() => {
    if (open) create.reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, create.reset]);

  const severityOptions: { value: IncidentSeverity; label: string }[] = [
    { value: "Low", label: t("severity.Low") },
    { value: "Medium", label: t("severity.Medium") },
    { value: "High", label: t("severity.High") },
    { value: "Critical", label: t("severity.Critical") },
  ];

  async function onSubmit(values: FormValues) {
    const payload: CreateIncidentInput = {
      title: values.title,
      description: values.description,
      severity: values.severity,
      status: "Open",
      assigneeId: values.assigneeId ?? null,
    };
    const created = await create.mutateAsync(payload);

    onClose();
    onCreated?.(created.id);
  }

  return (
    <Modal
      title={t("create.title")}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden={true}
    >
      {create.isError ? (
        <Alert
          type="error"
          showIcon
          title={t("create.error")}
          style={{ marginBottom: 12 }}
        />
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
          <Form.Item
            label={<span style={LABEL_COL_STYLE}>{t("form.title")}</span>}
            validateStatus={errors.title ? "error" : ""}
            help={errors.title ? t(errors.title.message as string) : null}
            style={{ marginBottom: 0 }}
          >
            <Input
              {...register("title")}
              value={watch("title")}
              onChange={(e) =>
                setValue("title", e.target.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              data-testid="create-incident-title"
              placeholder={t("create.titlePlaceholder")}
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label={<span style={LABEL_COL_STYLE}>{t("form.description")}</span>}
            validateStatus={errors.description ? "error" : ""}
            help={
              errors.description
                ? t(errors.description.message as string)
                : null
            }
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              {...register("description")}
              value={watch("description")}
              onChange={(e) =>
                setValue("description", e.target.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              data-testid="create-incident-description"
              placeholder={t("create.descriptionPlaceholder")}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={LABEL_COL_STYLE}>{t("form.severity")}</span>}
            validateStatus={errors.severity ? "error" : ""}
            help={errors.severity ? t("form.required") : null}
            style={{ marginBottom: 0 }}
            data-testid="create-incident-severity"
          >
            <Select
              value={watch("severity")}
              options={severityOptions}
              onChange={(v) =>
                setValue("severity", v, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </Form.Item>

          <Form.Item
            label={<span style={LABEL_COL_STYLE}>{t("form.assignee")}</span>}
            style={{ marginBottom: 0 }}
            data-testid="create-incident-assignee"
          >
            <Select
              allowClear
              value={watch("assigneeId") ?? undefined}
              placeholder={t("common.unassigned")}
              options={users.map((u) => ({ value: u.id, label: u.name }))}
              onChange={(v) =>
                setValue("assigneeId", v ?? null, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onClear={() =>
                setValue("assigneeId", null, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 6,
            }}
          >
            <Button onClick={onClose}>{t("common.cancel")}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting || create.isPending}
              data-testid="create-incident-submit"
            >
              {t("create.submit")}
            </Button>
          </div>
        </Space>
      </form>
    </Modal>
  );
}
