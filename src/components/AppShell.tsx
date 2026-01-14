import { Layout } from "antd";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

const { Header, Content } = Layout;

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: 0,
          height: 64,
        }}
      >
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#003755",
              }}
              aria-hidden="true"
            />
            <div style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
              {t("app.brand", "Danske Bank")}
            </div>
          </div>

          <div style={{ opacity: 0.7, fontSize: 13 }}>
            {t("app.area", "Incident Management")}
          </div>
        </div>
      </Header>

      <Content>{children}</Content>
    </Layout>
  );
}
