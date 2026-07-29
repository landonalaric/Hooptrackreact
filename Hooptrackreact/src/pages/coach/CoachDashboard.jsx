import { useState } from "react";
import Layout from "../../components/Layout";
import RosterTab from "./tabs/RosterTab";
import AttendanceTab from "./tabs/AttendanceTab";
import FitnessTab from "./tabs/FitnessTab";
import SchedulesTab from "../shared/SchedulesTab";
import AnnouncementsTab from "../shared/AnnouncementsTab";

const TABS = [
  { key: "roster", label: "Roster" },
  { key: "attendance", label: "Attendance" },
  { key: "fitness", label: "Fitness & injuries" },
  { key: "schedules", label: "Schedule" },
  { key: "announcements", label: "Announcements" },
];

export default function CoachDashboard() {
  const [tab, setTab] = useState("roster");

  return (
    <Layout kicker="Coach" title="Team overview">
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roster" && <RosterTab />}
      {tab === "attendance" && <AttendanceTab />}
      {tab === "fitness" && <FitnessTab />}
      {tab === "schedules" && <SchedulesTab canCreate />}
      {tab === "announcements" && <AnnouncementsTab canCreate />}
    </Layout>
  );
}
