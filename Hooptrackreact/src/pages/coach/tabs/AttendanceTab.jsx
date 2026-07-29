import { useState } from "react";
import useApiList from "../../../hooks/useApiList";
import { endpoints, extractError } from "../../../api/client";
import { Card, Alert, DataTable, SelectField, Field, Button, Badge } from "../../../components/ui";

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "EXCUSED", label: "Excused" },
];

const TONE = { PRESENT: "green", ABSENT: "red", EXCUSED: "amber" };

export default function AttendanceTab() {
  const { items: records, loading, create } = useApiList(endpoints.attendance);
  const { items: players } = useApiList(endpoints.players);
  const { items: schedules } = useApiList(endpoints.schedules);

  const [form, setForm] = useState({ player: "", schedule: "", date: "", status: "PRESENT" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await create({ ...form, player: Number(form.player), schedule: Number(form.schedule) });
      setForm({ player: "", schedule: "", date: "", status: "PRESENT" });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const playerOptions = players.map((p) => ({ value: p.id, label: `${p.fullname} (${p.player_code})` }));
  const scheduleOptions = schedules.map((s) => ({ value: s.id, label: s.title }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.3fr", gap: 20, alignItems: "start" }}>
      <Card title="Mark attendance">
        <Alert>{error}</Alert>
        <form onSubmit={handleSubmit}>
          <SelectField label="Player" options={playerOptions.length ? playerOptions : [{ value: "", label: "No players yet" }]} value={form.player} onChange={update("player")} required />
          <SelectField label="Session" options={scheduleOptions.length ? scheduleOptions : [{ value: "", label: "No sessions yet" }]} value={form.schedule} onChange={update("schedule")} required />
          <Field label="Date" type="date" value={form.date} onChange={update("date")} required />
          <SelectField label="Status" options={STATUS_OPTIONS} value={form.status} onChange={update("status")} />
          <Button type="submit" disabled={submitting || !playerOptions.length || !scheduleOptions.length}>
            {submitting ? "Saving…" : "Save record"}
          </Button>
        </form>
      </Card>

      <Card title={`Attendance log (${records.length})`}>
        {loading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "player", header: "Player", render: (r) => players.find((p) => p.id === r.player)?.fullname || `#${r.player}` },
              { key: "schedule", header: "Session", render: (r) => schedules.find((s) => s.id === r.schedule)?.title || `#${r.schedule}` },
              { key: "date", header: "Date" },
              { key: "status", header: "Status", render: (r) => <Badge tone={TONE[r.status]}>{r.status}</Badge> },
            ]}
            rows={records}
            emptyLabel="No attendance recorded yet."
          />
        )}
      </Card>
    </div>
  );
}
