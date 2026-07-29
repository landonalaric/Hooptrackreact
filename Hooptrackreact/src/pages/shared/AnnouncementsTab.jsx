import { useState } from "react";
import useApiList from "../../hooks/useApiList";
import { endpoints, extractError } from "../../api/client";
import { Card, Alert, Field, TextAreaField, Button } from "../../components/ui";

export default function AnnouncementsTab({ canCreate = true }) {
  const { items: announcements, loading, create, error: loadError } = useApiList(endpoints.announcements);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await create(form);
      setForm({ title: "", content: "" });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: canCreate ? "0.9fr 1.3fr" : "1fr", gap: 20, alignItems: "start" }}>
      {canCreate && (
        <Card title="New announcement">
          <Alert>{error}</Alert>
          <form onSubmit={handleSubmit}>
            <Field label="Title" value={form.title} onChange={update("title")} required />
            <TextAreaField label="Message" value={form.content} onChange={update("content")} required />
            <Button type="submit" disabled={submitting}>{submitting ? "Posting…" : "Post announcement"}</Button>
          </form>
        </Card>
      )}

      <Card title={`Announcements (${announcements.length})`}>
        <Alert>{loadError}</Alert>
        {loading ? <p>Loading…</p> : announcements.length === 0 ? (
          <p style={{ color: "var(--ink-400)" }}>Nothing posted yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {announcements.map((a) => (
              <div key={a.id} style={{ borderBottom: "1px solid var(--chalk-100)", paddingBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: 14 }}>{a.title}</strong>
                  <span style={{ fontSize: 11.5, color: "var(--ink-400)", fontFamily: "var(--font-mono)" }}>
                    {new Date(a.date_sent).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--ink-600)", margin: "6px 0 0" }}>{a.content}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
