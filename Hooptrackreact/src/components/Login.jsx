import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/ui";

const ROLE_HOME = {
  SUPERADMIN: "/superadmin",
  ADMIN: "/admin",
  COACH: "/coach",
  GUARDIAN: "/guardian",
  SCOUT: "/scout",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "", coach_id: "", player_code: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(ROLE_HOME[user.role] || "/");
    } catch (err) {
      setError(err.message);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div>
          <div className="kicker bg-blue-500">Matchday // Academy Ops</div>
          <h1>One platform for the whole squad, off the pitch.</h1>
        </div>
      
      </div>

      <div className="form-side">
        <div className="box">
          <div className="display">Sign in</div>
          <p className="lead">Use the account your academy set up for you.</p>

          <Alert>{error}</Alert>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Username</label>
              <input value={form.username} onChange={update("username")} required autoFocus />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={update("password")} required />
            </div>

            {!showExtra ? (
              <button type="button" className="link-btn" onClick={() => setShowExtra(true)} style={{ marginBottom: 16 }}>
                Signing in as a coach or guardian?
              </button>
            ) : (
              <>
                <div className="field">
                  <label>Coach ID (coaches only)</label>
                  <input value={form.coach_id} onChange={update("coach_id")} placeholder="e.g. CH-2201" />
                </div>
                <div className="field">
                  <label>Player code (guardians only)</label>
                  <input value={form.player_code} onChange={update("player_code")} placeholder="e.g. PLY-4471" />
                </div>
              </>
            )}

            <button className="btn bg-red-400 hover:bg-green-400" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}
