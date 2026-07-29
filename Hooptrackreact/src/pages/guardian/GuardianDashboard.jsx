import { useState } from "react";
import Layout from "../../components/Layout";
import OverviewTab from "./tabs/OverviewTab";
import FeesTab from "./tabs/FeesTab";
import PaymentsTab from "./tabs/PaymentsTab";
import AnnouncementsTab from "../shared/AnnouncementsTab";

const TABS = [
  { key: "overview", label: "My player" },
  { key: "fees", label: "Fee receipts" },
  { key: "payments", label: "Payments" },
  { key: "announcements", label: "Announcements" },
];

export default function GuardianDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <Layout kicker="Guardian" title="Family overview">
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "fees" && <FeesTab />}
      {tab === "payments" && <PaymentsTab />}
      {tab === "announcements" && <AnnouncementsTab canCreate={false} />}
    </Layout>
  );
}
