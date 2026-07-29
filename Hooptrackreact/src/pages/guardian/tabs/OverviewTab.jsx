import useApiList from "../../../hooks/useApiList";
import { endpoints } from "../../../api/client";
import { Card, DataTable, Badge, CodeChip, StatCard } from "../../../components/ui";

const TONE = { PRESENT: "green", ABSENT: "red", EXCUSED: "amber" };

export default function OverviewTab() {
  const { items: players, loading: playersLoading } = useApiList(endpoints.players);
  const { items: attendance, loading: attLoading } = useApiList(endpoints.attendance);
  const { items: fitness, loading: fitLoading } = useApiList(endpoints.fitness);

  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;

  return (
    <div>
      <div className="stat-grid">
        <StatCard label="Linked player(s)" value={players.length} />
        <StatCard label="Sessions attended" value={presentCount} />
        <StatCard label="Fitness logs" value={fitness.length} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card title="Player profile">
          {playersLoading ? <p>Loading…</p> : (
            <DataTable
              columns={[
                { key: "fullname", header: "Name" },
                { key: "player_code", header: "Code", render: (r) => <CodeChip>{r.player_code}</CodeChip> },
                { key: "age_group", header: "Age group" },
                { key: "date_of_birth", header: "Date of birth" },
                { key: "medical_info", header: "Medical notes", render: (r) => r.medical_info || "—" },
              ]}
              rows={players}
              emptyLabel="No linked player found — check the player code with your academy admin."
            />
          )}
        </Card>

        <Card title="Attendance history">
          {attLoading ? <p>Loading…</p> : (
            <DataTable
              columns={[
                { key: "date", header: "Date" },
                { key: "status", header: "Status", render: (r) => <Badge tone={TONE[r.status]}>{r.status}</Badge> },
              ]}
              rows={attendance}
              emptyLabel="No attendance recorded yet."
            />
          )}
        </Card>

        <Card title="Fitness & injury history">
          {fitLoading ? <p>Loading…</p> : (
            <DataTable
              columns={[
                { key: "logged_date", header: "Date" },
                { key: "fitness_status", header: "Fitness" },
                { key: "injury_status", header: "Injury" },
                { key: "weight_kg", header: "Weight", render: (r) => (r.weight_kg ? `${r.weight_kg} kg` : "—") },
              ]}
              rows={fitness}
              emptyLabel="No fitness logs yet."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
