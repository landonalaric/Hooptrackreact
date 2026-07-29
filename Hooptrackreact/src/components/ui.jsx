export function Card({ title, action, children }) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200">
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function Button({ children, variant = "primary", size, ...rest }) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition";

  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size || "md"]}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({ label, ...rest }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
        {...rest}
      />
    </div>
  );
}

export function SelectField({ label, options, ...rest }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({ label, ...rest }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <textarea
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 outline-none"
        {...rest}
      />
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  emptyLabel = "Nothing here yet.",
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.id ?? i} className="border-t hover:bg-gray-50">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Badge({ children, tone = "gray" }) {
  const colors = {
    gray: "bg-gray-200 text-gray-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors[tone]}`}
    >
      {children}
    </span>
  );
}

export function CodeChip({ children }) {
  return (
    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">
      {children}
    </span>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow border border-gray-200 text-center">
      <div className="text-4xl font-bold text-green-600">{value}</div>
      <div className="mt-2 text-gray-500">{label}</div>
    </div>
  );
}

export function Alert({ type = "error", children }) {
  if (!children) return null;

  const colors = {
    error: "bg-red-100 text-red-700 border-red-300",
    success: "bg-green-100 text-green-700 border-green-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
    info: "bg-blue-100 text-blue-700 border-blue-300",
  };

  return (
    <div className={`mb-4 rounded-lg border p-3 ${colors[type]}`}>
      {children}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-gray-500">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></div>
      <span>{label}</span>
    </div>
  );
}