import { useState } from "react";
import client, { endpoints, extractError } from "../../../api/client";
import { Card, Alert, SelectField, Field } from "../../../components/ui";

const ROLES = [
  { value: "ADMIN", label: "Academy Admin" },
  { value: "COACH", label: "Coach" },
  { value: "GUARDIAN", label: "Guardian" },
  { value: "SCOUT", label: "Scout" },
];

const EMPTY = {
  role: "COACH", username: "", email: "", password: "", fullname: "", phone_number: "",
  coach_id: "", player_code: "", region: "",
};

export default function StaffTab() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await client.post(endpoints.createUser, form);
      setSuccess(res.data.message || "Profile created.");
      setForm({ ...EMPTY, role: form.role });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 620 }}>
      <Card title="Add a coach, guardian, scout, or fellow admin">
        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>
        <form onSubmit={handleSubmit}>
          <SelectField label="Role" options={ROLES} value={form.role} onChange={update("role")} />
          <div className="form-grid">
            <Field label="Full name" value={form.fullname} onChange={update("fullname")} required />
            <Field label="Username" value={form.username} onChange={update("username")} required />
            <Field label="Email" type="email" value={form.email} onChange={update("email")} required />
            <Field label="Phone number" value={form.phone_number} onChange={update("phone_number")} />
            <div className="field-full">
              <Field label="Password" type="password" value={form.password} onChange={update("password")} required />
            </div>
          </div>

          {form.role === "COACH" && (
            <Field label="Coach ID (used at login)" value={form.coach_id} onChange={update("coach_id")} placeholder="e.g. CH-2201" required />
          )}
          {form.role === "GUARDIAN" && (
            <Field label="Player code (links guardian to their child)" value={form.player_code} onChange={update("player_code")} placeholder="e.g. PLY-4471" required />
          )}
          {form.role === "SCOUT" && (
            <Field label="Region" value={form.region} onChange={update("region")} placeholder="e.g. East Africa" />
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create profile"}
          </button>
        </form>
      </Card>
    </div>
  );
}
