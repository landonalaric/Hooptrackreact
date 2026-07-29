import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import client, { endpoints, extractError } from "../../api/client";
import { Card, Alert, DataTable, CodeChip, StatCard } from "../../components/ui";

const EMPTY = {
  academy_name: "", location: "",
  admin_username: "", admin_email: "", admin_password: "",
  admin_fullname: "", admin_phone_number: "",
};

export default function SuperAdminDashboard() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [academies, setAcademies] = useState([]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const loadAcademies = () => {
    client.get(endpoints.academies).then((res) => setAcademies(res.data)).catch(() => {});
  };

  useEffect(loadAcademies, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await client.post(endpoints.registerAcademy, form);
      setSuccess(`${res.data.academy.name} is live, with ${res.data.admin.username} as admin.`);
      setForm(EMPTY);
      loadAcademies();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout kicker="Super Admin" title="Register a new academy">
      <div className="stat-grid">
        <StatCard label="Academies on Matchday" value={academies.length} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "start" }}>
        <Card title="New academy + admin">
          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Academy name</label>
                <input value={form.academy_name} onChange={update("academy_name")} required />
              </div>
              <div className="field">
                <label>Location</label>
                <input value={form.location} onChange={update("location")} required />
              </div>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid var(--chalk-200)", margin: "8px 0 16px" }} />
            <div className="form-grid">
              <div className="field">
                <label>Admin full name</label>
                <input value={form.admin_fullname} onChange={update("admin_fullname")} required />
              </div>
              <div className="field">
                <label>Admin username</label>
                <input value={form.admin_username} onChange={update("admin_username")} required />
              </div>
              <div className="field">
                <label>Admin email</label>
                <input type="email" value={form.admin_email} onChange={update("admin_email")} required />
              </div>
              <div className="field">
                <label>Admin phone</label>
                <input value={form.admin_phone_number} onChange={update("admin_phone_number")} />
              </div>
              <div className="field field-full">
                <label>Admin password</label>
                <input type="password" value={form.admin_password} onChange={update("admin_password")} required />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Registering…" : "Register academy"}
            </button>
          </form>
        </Card>

        <Card title="All academies">
          <DataTable
            columns={[
              { key: "name", header: "Academy" },
              { key: "location", header: "Location" },
              { key: "id", header: "ID", render: (r) => <CodeChip>#{r.id}</CodeChip> },
              { key: "created_at", header: "Created", render: (r) => new Date(r.created_at).toLocaleDateString() },
            ]}
            rows={academies}
            emptyLabel="No academies registered yet."
          />
        </Card>
      </div>
    </Layout>
  );
}
