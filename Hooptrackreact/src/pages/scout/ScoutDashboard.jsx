import { useState } from "react";
import Layout from "../../components/Layout";
import useApiList from "../../hooks/useApiList";
import { endpoints, extractError } from "../../api/client";
import { Card, Alert, Field, SelectField, TextAreaField, Button, Badge, StatCard } from "../../components/ui";

const STATUS_OPTIONS = [
  { value: "PROSPECT", label: "Prospect" },
  { value: "PROVEN", label: "Proven" },
];

const EMPTY = { player_name: "", age: "", potential_overall: "", status: "PROSPECT", comments: "" };

export default function ScoutDashboard() {
  const { items: reports, loading, create } = useApiList(endpoints.scoutReports);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await create({ ...form, age: Number(form.age), potential_overall: Number(form.potential_overall) });
      setForm(EMPTY);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reports.length
    ? Math.round(reports.reduce((sum, r) => sum + r.potential_overall, 0) / reports.length)
    : "—";

  return (
    <Layout kicker="Scout" title="Scouting reports">
      <div className="stat-grid">
        <StatCard label="Reports logged" value={reports.length} />
        <StatCard label="Average potential" value={avgRating} />
        <StatCard label="Proven talents" value={reports.filter((r) => r.status === "PROVEN").length} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.3fr", gap: 20, alignItems: "start" }}>
        <Card title="New scouting report">
          <Alert>{error}</Alert>
          <form onSubmit={handleSubmit}>
            <Field label="Player name" value={form.player_name} onChange={update("player_name")} required />
            <div className="form-grid">
              <Field label="Age" type="number" value={form.age} onChange={update("age")} required />
              <Field label="Potential (1–99)" type="number" min="1" max="99" value={form.potential_overall} onChange={update("potential_overall")} required />
            </div>
            <SelectField label="Status" options={STATUS_OPTIONS} value={form.status} onChange={update("status")} />
            <TextAreaField label="Comments" value={form.comments} onChange={update("comments")} required placeholder="Playing style, standout attributes, areas to develop…" />
            <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Log report"}</Button>
          </form>
        </Card>

        <Card title={`Your reports (${reports.length})`}>
          {loading ? <p>Loading…</p> : reports.length === 0 ? (
            <p style={{ color: "var(--ink-400)" }}>No reports filed yet — the form on the left logs your first prospect.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reports.map((r) => (
                <div key={r.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", borderBottom: "1px solid var(--chalk-100)", paddingBottom: 12 }}>
                  <div className="rating-badge">{r.potential_overall}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <strong style={{ fontSize: 14 }}>{r.player_name} <span style={{ color: "var(--ink-400)", fontWeight: 500 }}>· age {r.age}</span></strong>
                      <Badge tone={r.status === "PROVEN" ? "green" : "amber"}>{r.status}</Badge>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-600)", margin: "6px 0 0" }}>{r.comments}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
