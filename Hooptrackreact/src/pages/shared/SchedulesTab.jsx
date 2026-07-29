import { useState } from "react";
import useApiList from "../../hooks/useApiList";
import { endpoints, extractError } from "../../api/client";
import { Card, Alert, DataTable, Field, SelectField, TextAreaField, Button } from "../../components/ui";

const EMPTY = { title: "", description: "", date_time: "", team: "" };

export default function SchedulesTab({ canCreate = true }) {
  const { items: schedules, loading, create, remove } = useApiList(endpoints.schedules);
  const { items: teams } = useApiList(endpoints.teams);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const teamOptions = teams.map((t) => ({ value: t.id, label: t.name }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await create({ ...form, team: Number(form.team) });
      setForm(EMPTY);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: canCreate ? "0.9fr 1.3fr" : "1fr", gap: 20, alignItems: "start" }}>
      {canCreate && (
        <Card title="New session">
          <Alert>{error}</Alert>
          <form onSubmit={handleSubmit}>
            <Field label="Title" value={form.title} onChange={update("title")} placeholder="e.g. Friday drills" required />
            <SelectField label="Team" options={teamOptions.length ? teamOptions : [{ value: "", label: "Add a team first" }]} value={form.team} onChange={update("team")} required />
            <Field label="Date & time" type="datetime-local" value={form.date_time} onChange={update("date_time")} required />
            <TextAreaField label="Notes" value={form.description} onChange={update("description")} placeholder="Optional" />
            <Button type="submit" disabled={submitting || !teamOptions.length}>{submitting ? "Scheduling…" : "Schedule session"}</Button>
          </form>
        </Card>
      )}

      <Card title={`Upcoming sessions (${schedules.length})`}>
        {loading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "title", header: "Session" },
              { key: "team", header: "Team", render: (r) => teams.find((t) => t.id === r.team)?.name || `#${r.team}` },
              { key: "date_time", header: "When", render: (r) => new Date(r.date_time).toLocaleString() },
              { key: "description", header: "Notes", render: (r) => r.description || "—" },
              ...(canCreate ? [{ key: "actions", header: "", render: (r) => (
                <Button variant="danger" size="sm" onClick={() => remove(r.id)}>Cancel</Button>
              ) }] : []),
            ]}
            rows={schedules}
            emptyLabel="No sessions scheduled yet."
          />
        )}
      </Card>
    </div>
  );
}
