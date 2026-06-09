export default function StatsBar({ stats }) {
  if (!stats) return null;
 
  const cards = [
    { label: "Total Employees",  value: stats.total_employees,                             accent: "#c2410c" },
    { label: "Active",           value: stats.active_employees,                            accent: "#4d7c5f" },
    { label: "On Leave",         value: stats.on_leave,                                    accent: "#d97706" },
    { label: "Departments",      value: stats.total_departments,                            accent: "#0369a1" },
    { label: "Avg. Salary",      value: `₹${(stats.average_salary / 100000).toFixed(1)}L`, accent: "#7c3aed" },
  ];
 
  return (
    <div className="stats-bar">
      {cards.map((c) => (
        <div className="stat-card" key={c.label} style={{ "--accent": c.accent }}>
          <p className="stat-value">{c.value}</p>
          <p className="stat-label">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
 