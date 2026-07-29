import { useState } from "react";
import useApiList from "../../../hooks/useApiList";
import { endpoints, extractError } from "../../../api/client";
import { Card, Alert, DataTable, SelectField, Field, TextAreaField, Button } from "../../../components/ui";

const EMPTY = { player: "", fitness_status: "", injury_status: "", weight_kg: "", height_cm: "" };

export default function FitnessTab() {
  const { items: logs, loading, create } = useApiList(endpoints.fitness);
  const { items: players } = useApiList(endpoints.players);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const playerOptions = players.map((p) => ({ value: p.id, label: `${p.fullname} (${p.player_code})` }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { player: Number(form.player) };
      if (form.fitness_status) payload.fitness_status = form.fitness_status;
      if (form.injury_status) payload.injury_status = form.injury_status;
      if (form.weight_kg) payload.weight_kg = form.weight_kg;
      if (form.height_cm) payload.height_cm = form.height_cm;
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
      <Card title="Log fitness & injury status">
        <Alert>{error}</Alert>
        <form onSubmit={handleSubmit}>
          <SelectField label="Player" options={playerOptions.length ? playerOptions : [{ value: "", label: "No players yet" }]} value={form.player} onChange={update("player")} required />
          <div className="form-grid">
            <Field label="Weight (kg)" type="number" step="0.1" value={form.weight_kg} onChange={update("weight_kg")} />
            <Field label="Height (cm)" type="number" step="0.1" value={form.height_cm} onChange={update("height_cm")} />
          </div>
          <TextAreaField label="Fitness status" value={form.fitness_status} onChange={update("fitness_status")} placeholder="e.g. Excellent condition, cleared for full training" />
          <TextAreaField label="Injury status" value={form.injury_status} onChange={update("injury_status")} placeholder="e.g. Healthy / no injuries" />
          <Button type="submit" disabled={submitting || !playerOptions.length}>{submitting ? "Saving…" : "Save log"}</Button>
        </form>
      </Card>

      <Card title={`Fitness logs (${logs.length})`}>
        {loading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "player", header: "Player", render: (r) => players.find((p) => p.id === r.player)?.fullname || `#${r.player}` },
              { key: "logged_date", header: "Date" },
              { key: "fitness_status", header: "Fitness" },
              { key: "injury_status", header: "Injury" },
              { key: "weight_kg", header: "Weight", render: (r) => (r.weight_kg ? `${r.weight_kg} kg` : "—") },
            ]}
            rows={logs}
            emptyLabel="No fitness logs yet."
          />
        )}
      </Card>
    </div>
  );
}
