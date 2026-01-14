import { Navigate, Route, Routes } from "react-router-dom";
import { IncidentsPage } from "./features/incidents/IncidentsPage";
import { AppShell } from "./components/AppShell";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/incidents" replace />} />
        <Route path="/incidents" element={<IncidentsPage />}>
          <Route path=":incidentId" element={null} />
        </Route>
        <Route path="*" element={<Navigate to="/incidents" replace />} />
      </Routes>
    </AppShell>
  );
}
