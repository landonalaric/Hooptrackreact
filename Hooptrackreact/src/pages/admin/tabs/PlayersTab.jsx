import { useState } from "react";
import useApiList from "../../../hooks/useApiList";
import { endpoints, extractError } from "../../../api/client";
import { Card, Alert, DataTable, Field, SelectField, Button, CodeChip } from "../../../components/ui";

const EMPTY = { fullname: "", player_code: "", date_of_birth: "", age_group: "", team: "", contact: "", medical_info: "" };

export default function PlayersTab() {
  const { items: players, loading, create, remove } = useApiList(endpoints.players);
  const { items: teams } = useApiList(endpoints.teams);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const teamOptions = [{ value: "", label: "Unassigned" }, ...teams.map((t) => ({ value: t.id, label: t.name }))];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.team) delete payload.team;
      await create(payload);
      setForm(EMPTY);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.3fr", gap: 20, alignItems: "start" }}>
      <Card title="Register a player">
        <Alert>{error}</Alert>
        <form onSubmit={handleSubmit}>
          <Field label="Full name" value={form.fullname} onChange={update("fullname")} required />
          <Field label="Player code" value={form.player_code} onChange={update("player_code")} placeholder="e.g. PLY-4471" required />
          <Field label="Date of birth" type="date" value={form.date_of_birth} onChange={update("date_of_birth")} required />
          <Field label="Age group" value={form.age_group} onChange={update("age_group")} placeholder="Under 14" />
          <SelectField label="Team" options={teamOptions} value={form.team} onChange={update("team")} />
          <Field label="Emergency contact" value={form.contact} onChange={update("contact")} required />
          <Field label="Medical notes" value={form.medical_info} onChange={update("medical_info")} placeholder="Optional" />
          <Button type="submit" disabled={submitting}>{submitting ? "Registering…" : "Register player"}</Button>
        </form>
      </Card>

      <Card title={`Players (${players.length})`}>
        {loading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "fullname", header: "Player" },
              { key: "player_code", header: "Code", render: (r) => <CodeChip>{r.player_code}</CodeChip> },
              { key: "age_group", header: "Age group" },
              { key: "team", header: "Team", render: (r) => teams.find((t) => t.id === r.team)?.name || "Unassigned" },
              { key: "actions", header: "", render: (r) => (
                <Button variant="danger" size="sm" onClick={() => remove(r.id)}>Remove</Button>
              ) },
            ]}
            rows={players}
            emptyLabel="No players registered yet."
          />
        )}
      </Card>
    </div>
  );
}
