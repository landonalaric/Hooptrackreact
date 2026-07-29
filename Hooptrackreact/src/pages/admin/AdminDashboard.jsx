import { useState } from "react";
import Layout from "../../components/Layout";
import TeamsTab from "./tabs/TeamsTab";
import PlayersTab from "./tabs/PlayersTab";
import StaffTab from "./tabs/StaffTab";
import FeesTab from "./tabs/FeesTab";
import SchedulesTab from "../shared/SchedulesTab";
import AnnouncementsTab from "../shared/AnnouncementsTab";

const TABS = [
  { key: "teams", label: "Teams" },
  { key: "players", label: "Players" },
  { key: "staff", label: "People" },
  { key: "schedules", label: "Schedule" },
  { key: "announcements", label: "Announcements" },
  { key: "fees", label: "Fees" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("teams");

  return (
    <Layout kicker="Academy Admin" title="Academy overview">
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "teams" && <TeamsTab />}
      {tab === "players" && <PlayersTab />}
      {tab === "staff" && <StaffTab />}
      {tab === "schedules" && <SchedulesTab canCreate />}
      {tab === "announcements" && <AnnouncementsTab canCreate />}
      {tab === "fees" && <FeesTab />}
    </Layout>
  );
}
