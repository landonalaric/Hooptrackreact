import useApiList from "../../../hooks/useApiList";
import { endpoints } from "../../../api/client";
import { Card, DataTable, Badge, CodeChip } from "../../../components/ui";

export default function FeesTab() {
  const { items: fees, loading: feesLoading } = useApiList(endpoints.fees);
  const { items: payments, loading: paymentsLoading } = useApiList(endpoints.payments);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card title={`M-Pesa receipt uploads (${fees.length})`}>
        {feesLoading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "receipt_no", header: "Receipt", render: (r) => <CodeChip>{r.receipt_no}</CodeChip> },
              { key: "amount", header: "Amount", render: (r) => `KSh ${r.amount}` },
              { key: "payment_method", header: "Method" },
              { key: "verified_by_admin", header: "Status", render: (r) => (
                r.verified_by_admin ? <Badge tone="green">Verified</Badge> : <Badge tone="amber">Pending</Badge>
              ) },
              { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
            ]}
            rows={fees}
            emptyLabel="No fee receipts uploaded yet."
          />
        )}
      </Card>

      <Card title={`Gateway payments (${payments.length})`}>
        {paymentsLoading ? <p>Loading…</p> : (
          <DataTable
            columns={[
              { key: "transaction_reference", header: "Reference", render: (r) => <CodeChip>{r.transaction_reference}</CodeChip> },
              { key: "amount", header: "Amount", render: (r) => `KSh ${r.amount}` },
              { key: "payment_method", header: "Method" },
              { key: "status", header: "Status", render: (r) => (
                <Badge tone={r.status === "COMPLETED" ? "green" : r.status === "FAILED" ? "red" : "amber"}>{r.status}</Badge>
              ) },
              { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
            ]}
            rows={payments}
            emptyLabel="No gateway payments yet."
          />
        )}
      </Card>
    </div>
  );
}
