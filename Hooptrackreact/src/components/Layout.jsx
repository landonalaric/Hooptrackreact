import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_BY_ROLE = {
  SUPERADMIN: [{ to: "/superadmin", label: "Register academy", end: true }],
  ADMIN: [{ to: "/admin", label: "Overview", end: true }],
  COACH: [{ to: "/coach", label: "Overview", end: true }],
  GUARDIAN: [{ to: "/guardian", label: "Overview", end: true }],
  SCOUT: [{ to: "/scout", label: "Overview", end: true }],
};

const ROLE_LABEL = {
  SUPERADMIN: "Super Admin",
  ADMIN: "Academy Admin",
  COACH: "Coach",
  GUARDIAN: "Guardian",
  SCOUT: "Scout",
};

export default function Layout({ kicker, title, children }) {
  const { user, logout } = useAuth();
  const links = NAV_BY_ROLE[user?.role] || [];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col justify-between shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold">
              MD
            </div>

            <div>
              <h2 className="text-xl font-bold">Matchday</h2>
              <p className="text-xs text-gray-300 tracking-widest">
                ACADEMY OPS
              </p>
            </div>
          </div>

          <nav>
            <p className="uppercase text-xs text-gray-400 font-semibold mb-4">
              Menu
            </p>

            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 mb-2 transition-all ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-700 p-6">
          <span className="inline-block bg-green-600 px-3 py-1 rounded-full text-xs font-semibold">
            {ROLE_LABEL[user?.role] || user?.role}
          </span>

          <p className="mt-3 text-sm text-gray-300">
            {user?.username}
          </p>

          <button
            onClick={logout}
            className="mt-5 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium transition"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-8 py-5 flex justify-between items-center">
          <div>
            {kicker && (
              <p className="text-sm uppercase tracking-wide text-green-600 font-semibold">
                {kicker}
              </p>
            )}

            <h1 className="text-3xl font-bold text-gray-800">
              {title}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-8 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}