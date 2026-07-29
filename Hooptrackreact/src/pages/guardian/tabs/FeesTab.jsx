import { useState } from "react";
import useApiList from "../../../hooks/useApiList";
import { endpoints, extractError } from "../../../api/client";
import { Card, Alert, DataTable, Field, Button, Badge, CodeChip } from "../../../components/ui";

export default function FeesTab() {
  const { items: fees, loading, create } = useApiList(endpoints.fees);
  const [form, setForm] = useState({ amount: "", receipt_no: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await create(form);
      setForm({ amount: "", receipt_no: "" });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.3fr", gap: 20, alignItems: "start" }}>
      <Card title="Upload M-Pesa receipt">
        <Alert>{error}</Alert>
        <form onSubmit={handleSubmit}>
          <Field label="Amount (KSh)" type="number" step="0.01" value={form.amount} onChange={update("amount")} required />
          <Field label="M-Pesa receipt number" value={form.receipt_no} onChange={update("receipt_no")} placeholder="e.g. QFT7X9K2LM" required />
          <Button type="submit" disabled={submitting}>{submitting ? "Uploading…" : "Submit receipt"}</Button>
        </form>
      </Card>

      <Card title={`Your fee history (${fees.length})`}>
        {loading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "receipt_no", header: "Receipt", render: (r) => <CodeChip>{r.receipt_no}</CodeChip> },
              { key: "amount", header: "Amount", render: (r) => `KSh ${r.amount}` },
              { key: "verified_by_admin", header: "Status", render: (r) => (
                r.verified_by_admin ? <Badge tone="green">Verified</Badge> : <Badge tone="amber">Pending review</Badge>
              ) },
              { key: "date", header: "Submitted", render: (r) => new Date(r.date).toLocaleDateString() },
            ]}
            rows={fees}
            emptyLabel="You haven't submitted any receipts yet."
          />
        )}
      </Card>
    </div>
  );
}
