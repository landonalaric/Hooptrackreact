import useApiList from "../../../hooks/useApiList";
import { endpoints } from "../../../api/client";
import { Card, DataTable, CodeChip, StatCard } from "../../../components/ui";

export default function RosterTab() {
  const { items: teams, loading: teamsLoading } = useApiList(endpoints.teams);
  const { items: players, loading: playersLoading } = useApiList(endpoints.players);

  return (
    <div>
      <div className="stat-grid">
        <StatCard label="Teams" value={teams.length} />
        <StatCard label="Players" value={players.length} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, alignItems: "start" }}>
        <Card title="Teams">
          {teamsLoading ? <p>Loading…</p> : (
            <DataTable
              columns={[
                { key: "name", header: "Team" },
                { key: "age_group", header: "Age group" },
              ]}
              rows={teams}
              emptyLabel="No teams assigned yet."
            />
          )}
        </Card>

        <Card title="Players">
          {playersLoading ? <p>Loading…</p> : (
            <DataTable
              columns={[
                { key: "fullname", header: "Player" },
                { key: "player_code", header: "Code", render: (r) => <CodeChip>{r.player_code}</CodeChip> },
                { key: "age_group", header: "Age group" },
                { key: "contact", header: "Emergency contact" },
              ]}
              rows={players}
              emptyLabel="No players yet."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
