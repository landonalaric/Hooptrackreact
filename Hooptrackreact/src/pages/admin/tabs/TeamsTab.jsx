import { useState } from "react";
import useApiList from "../../../hooks/useApiList";
import { endpoints, extractError } from "../../../api/client";
import { Card, Alert, DataTable, Field, Button, CodeChip } from "../../../components/ui";

export default function TeamsTab() {
  const { items: teams, loading, create, remove } = useApiList(endpoints.teams);
  const [form, setForm] = useState({ name: "", age_group: "", coach: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { name: form.name, age_group: form.age_group };
      if (form.coach) payload.coach = Number(form.coach);
      await create(payload);
      setForm({ name: "", age_group: "", coach: "" });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.3fr", gap: 20, alignItems: "start" }}>
      <Card title="New team">
        <Alert>{error}</Alert>
        <form onSubmit={handleSubmit}>
          <Field label="Team name" value={form.name} onChange={update("name")} required placeholder="e.g. Panthers U14" />
          <Field label="Age group" value={form.age_group} onChange={update("age_group")} required placeholder="e.g. Under 14" />
          <Field label="Coach profile ID (optional)" value={form.coach} onChange={update("coach")} placeholder="Leave blank to assign later" />
          <Button type="submit" disabled={submitting}>{submitting ? "Creating…" : "Create team"}</Button>
        </form>
      </Card>

      <Card title={`Teams (${teams.length})`}>
        {loading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "name", header: "Team" },
              { key: "age_group", header: "Age group" },
              { key: "coach", header: "Coach", render: (r) => (r.coach ? <CodeChip>Coach #{r.coach}</CodeChip> : "Unassigned") },
              { key: "actions", header: "", render: (r) => (
                <Button variant="danger" size="sm" onClick={() => remove(r.id)}>Remove</Button>
              ) },
            ]}
            rows={teams}
            emptyLabel="No teams yet. Create the first one."
          />
        )}
      </Card>
    </div>
  );
}
