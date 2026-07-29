import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client, { endpoints, extractError } from "../../api/client";
import { Alert } from "../../components/ui";

export default function ScoutSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", fullname: "", phone_number: "", region: "" });
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
      await client.post(endpoints.scoutSignup, form);
      setSuccess("You're registered. Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div>
          <div className="kicker">Matchday // Scouting Network</div>
          <h1>Spot talent. Log it once. Never lose a lead.</h1>
        </div>
        <div className="roster">
          <span>Independent scouts</span>
          <span>Global coverage</span>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-box">
          <div className="display">Scout registration</div>
          <p className="lead">Create your own account — no academy invite needed.</p>

          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input value={form.fullname} onChange={update("fullname")} required />
            </div>
            <div className="field">
              <label>Username</label>
              <input value={form.username} onChange={update("username")} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={update("email")} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={update("password")} required />
            </div>
            <div className="field">
              <label>Phone number</label>
              <input value={form.phone_number} onChange={update("phone_number")} />
            </div>
            <div className="field">
              <label>Region</label>
              <input value={form.region} onChange={update("region")} placeholder="e.g. East Africa" />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p style={{ fontSize: 13, color: "var(--ink-600)", marginTop: 18 }}>
            Already have an account? <Link to="/login" className="link-btn">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
