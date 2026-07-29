import { useState } from "react";
import useApiList from "../../../hooks/useApiList";
import { endpoints, extractError } from "../../../api/client";
import { Card, Alert, DataTable, Field, SelectField, Button, Badge, CodeChip } from "../../../components/ui";

const METHODS = [
  { value: "MPESA", label: "M-Pesa" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "VISA", label: "Visa card" },
  { value: "MASTERCARD", label: "MasterCard" },
  { value: "KCB", label: "KCB bank transfer" },
  { value: "COOP_BANK", label: "Co-operative Bank transfer" },
];

const STATUS_TONE = { COMPLETED: "green", PENDING: "amber", FAILED: "red" };

export default function PaymentsTab() {
  const { items: payments, loading, create } = useApiList(endpoints.payments);
  const [form, setForm] = useState({ amount: "", payment_method: "MPESA", transaction_reference: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await create(form);
      setForm({ amount: "", payment_method: form.payment_method, transaction_reference: "" });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.3fr", gap: 20, alignItems: "start" }}>
      <Card title="Make a payment">
        <Alert>{error}</Alert>
        <form onSubmit={handleSubmit}>
          <SelectField label="Payment method" options={METHODS} value={form.payment_method} onChange={update("payment_method")} />
          <Field label="Amount (KSh)" type="number" step="0.01" value={form.amount} onChange={update("amount")} required />
          <Field label="Transaction reference" value={form.transaction_reference} onChange={update("transaction_reference")} placeholder="M-Pesa code, PayPal ID, or bank slip ref" required />
          <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit payment"}</Button>
        </form>
      </Card>

      <Card title={`Payment history (${payments.length})`}>
        {loading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "transaction_reference", header: "Reference", render: (r) => <CodeChip>{r.transaction_reference}</CodeChip> },
              { key: "payment_method", header: "Method" },
              { key: "amount", header: "Amount", render: (r) => `KSh ${r.amount}` },
              { key: "status", header: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
              { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
            ]}
            rows={payments}
            emptyLabel="No payments made yet."
          />
        )}
      </Card>
    </div>
  );
}
