import { useState, useEffect, useCallback } from "react";
import {
  getEmployees, createEmployee, updateEmployee, deleteEmployee,
  getDepartments, createDepartment, deleteDepartment, getStats,
} from "./api/employeeApi";
import EmployeeModal from "./components/EmployeeModal";
import Chatbot       from "./components/Chatbot";
import "./App.css";

const BADGE = {
  active:   { label: "Active",   cls: "badge-green"  },
  inactive: { label: "Inactive", cls: "badge-grey"   },
  on_leave: { label: "On Leave", cls: "badge-amber"  },
};

export default function App() {
  const [employees,      setEmployees]      = useState([]);
  const [departments,    setDepartments]    = useState([]);
  const [stats,          setStats]          = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [filterDept,     setFilterDept]     = useState("");
  const [modal,          setModal]          = useState({ open: false, employee: null });
  const [confirmDelete,  setConfirmDelete]  = useState(null);
  const [tab,            setTab]            = useState("employees");
  const [newDept,        setNewDept]        = useState({ name: "", description: "" });
  const [toast,          setToast]          = useState(null);
  const [viewEmp,        setViewEmp]        = useState(null);
  const [chatOpen,       setChatOpen]       = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [emps, depts, st] = await Promise.all([
        getEmployees({ search: search || undefined, department_id: filterDept || undefined }),
        getDepartments(),
        getStats(),
      ]);
      setEmployees(emps);
      setDepartments(depts);
      setStats(st);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterDept]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSave = async (data) => {
    if (modal.employee) { await updateEmployee(modal.employee.id, data); showToast("Employee updated"); }
    else                { await createEmployee(data);                     showToast("Employee added");   }
    await loadAll();
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
    setConfirmDelete(null);
    showToast("Employee removed");
    await loadAll();
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!newDept.name.trim()) return;
    await createDepartment(newDept);
    setNewDept({ name: "", description: "" });
    showToast("Department added");
    await loadAll();
  };

  const handleDelDept = async (id) => {
    await deleteDepartment(id);
    showToast("Department removed");
    await loadAll();
  };

  const initials = e => (e.first_name[0] + e.last_name[0]).toUpperCase();

  return (
    <div className="shell">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">P</span>
          <span className="brand-name">PeopleOS</span>
        </div>
        <nav className="nav">
          {[["employees","People"],["departments","Teams"]].map(([key,label]) => (
            <button key={key} className={`nav-btn ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
              <span className="nav-dot" />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-meta">
          <p>FastAPI · MySQL · React</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="content">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">{tab === "employees" ? "People" : "Teams"}</h1>
            <p className="page-sub">
              {tab === "employees"
                ? `${employees.length} ${employees.length === 1 ? "person" : "people"}`
                : `${departments.length} ${departments.length === 1 ? "team" : "teams"}`}
            </p>
          </div>
          {tab === "employees" && (
            <button className="btn-primary" onClick={() => setModal({ open: true, employee: null })}>
              + Add person
            </button>
          )}
        </div>

        {tab === "employees" ? (
          <>
            {/* Stats */}
            {stats && (
              <div className="stats-row">
                {[
                  { label: "Total",       value: stats.total_employees,   color: "#6366f1" },
                  { label: "Active",      value: stats.active_employees,  color: "#10b981" },
                  { label: "On Leave",    value: stats.on_leave,          color: "#f59e0b" },
                  { label: "Teams",       value: stats.total_departments, color: "#3b82f6" },
                  { label: "Avg Salary",  value: `₹${(stats.average_salary/100000).toFixed(1)}L`, color: "#ec4899" },
                ].map(s => (
                  <div className="stat-tile" key={s.label} style={{ "--c": s.color }}>
                    <p className="stat-num">{s.value}</p>
                    <p className="stat-lbl">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="filter-row">
              <input className="search-box" placeholder="Search name, email, role…"
                value={search} onChange={e => setSearch(e.target.value)} />
              <select className="dept-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                <option value="">All teams</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="table-card">
              {loading ? (
                <div className="empty">Loading…</div>
              ) : employees.length === 0 ? (
                <div className="empty">No people found.</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Person</th><th>Role</th><th>Team</th>
                      <th>Salary</th><th>Joined</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id}>
                        <td>
                          <div className="person-cell">
                            <div className="avatar" style={{ background: emp.avatar_color }}>{initials(emp)}</div>
                            <div>
                              <p className="person-name">{emp.first_name} {emp.last_name}</p>
                              <p className="person-email">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="td-muted">{emp.position}</td>
                        <td className="td-muted">{emp.department?.name ?? "—"}</td>
                        <td className="td-muted">₹{Number(emp.salary).toLocaleString("en-IN")}</td>
                        <td className="td-muted">{emp.hire_date}</td>
                        <td><span className={`badge ${BADGE[emp.status]?.cls}`}>{BADGE[emp.status]?.label}</span></td>
                        <td>
                          <div className="row-actions">
                            <button className="icon-btn" title="View"   onClick={() => setViewEmp(emp)}>↗</button>
                            <button className="icon-btn" title="Edit"   onClick={() => setModal({ open: true, employee: emp })}>✎</button>
                            <button className="icon-btn danger" title="Delete" onClick={() => setConfirmDelete(emp)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          /* ── Teams tab ── */
          <div className="teams-page">
            <form className="add-team-form" onSubmit={handleAddDept}>
              <input placeholder="Team name" value={newDept.name}
                onChange={e => setNewDept(d => ({ ...d, name: e.target.value }))} required />
              <input placeholder="Description (optional)" value={newDept.description}
                onChange={e => setNewDept(d => ({ ...d, description: e.target.value }))} />
              <button type="submit" className="btn-primary">Add team</button>
            </form>
            <div className="teams-grid">
              {departments.map(d => {
                const count = employees.filter(e => e.department_id === d.id).length;
                return (
                  <div className="team-card" key={d.id}>
                    <div className="team-card-top">
                      <div className="team-initial">{d.name[0]}</div>
                      <button className="icon-btn danger" onClick={() => handleDelDept(d.id)}>✕</button>
                    </div>
                    <h3 className="team-name">{d.name}</h3>
                    <p className="team-desc">{d.description || "No description"}</p>
                    <p className="team-count">{count} {count === 1 ? "person" : "people"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      <EmployeeModal
        open={modal.open} employee={modal.employee} departments={departments}
        onClose={() => setModal({ open: false, employee: null })} onSave={handleSave}
      />

      {viewEmp && (
        <div className="overlay" onClick={() => setViewEmp(null)}>
          <div className="modal-box view-box" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <h2 className="modal-title">Profile</h2>
              <button className="modal-x" onClick={() => setViewEmp(null)}>✕</button>
            </div>
            <div className="view-body">
              <div className="view-avatar" style={{ background: viewEmp.avatar_color }}>{initials(viewEmp)}</div>
              <h3 className="view-name">{viewEmp.first_name} {viewEmp.last_name}</h3>
              <p className="view-role">{viewEmp.position}</p>
              <span className={`badge ${BADGE[viewEmp.status]?.cls}`}>{BADGE[viewEmp.status]?.label}</span>
              <div className="view-grid">
                {[
                  ["Email",   viewEmp.email],
                  ["Phone",   viewEmp.phone || "—"],
                  ["Team",    viewEmp.department?.name || "—"],
                  ["Salary",  `₹${Number(viewEmp.salary).toLocaleString("en-IN")}`],
                  ["Joined",  viewEmp.hire_date],
                  ["ID",      `#${String(viewEmp.id).padStart(4,"0")}`],
                ].map(([k, v]) => (
                  <div className="view-cell" key={k}>
                    <p className="view-key">{k}</p>
                    <p className="view-val">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="overlay">
          <div className="modal-box confirm-box">
            <h3 className="confirm-title">Remove {confirmDelete.first_name}?</h3>
            <p className="confirm-msg">
              This permanently deletes {confirmDelete.first_name} {confirmDelete.last_name} from the system.
            </p>
            <div className="modal-actions">
              <button className="btn-ghost"  onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat ── */}
      <button className="chat-fab" onClick={() => setChatOpen(o => !o)}>
        {chatOpen ? "✕" : "💬"}
      </button>
      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}

      {/* ── Toast ── */}
      {toast && <div className={`toast ${toast.type === "error" ? "toast-err" : "toast-ok"}`}>{toast.msg}</div>}
    </div>
  );
}