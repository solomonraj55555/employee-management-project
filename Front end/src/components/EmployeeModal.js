import { useState, useEffect } from "react";

const COLORS = ["#6366f1","#ec4899","#10b981","#f59e0b","#3b82f6","#8b5cf6","#06b6d4","#f43f5e","#84cc16","#fb923c"];
const STATUSES = [{ value:"active",label:"Active"},{ value:"inactive",label:"Inactive"},{ value:"on_leave",label:"On Leave"}];
const EMPTY = { first_name:"",last_name:"",email:"",phone:"",position:"",department_id:"",salary:"",hire_date:"",status:"active",avatar_color:"#6366f1" };

export default function EmployeeModal({ open, onClose, onSave, employee, departments }) {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (open) {
      setForm(employee ? { ...employee, department_id: employee.department_id ?? "" } : EMPTY);
      setErrors({});
    }
  }, [employee, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim())                        e.first_name = "Required";
    if (!form.last_name.trim())                         e.last_name  = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.position.trim())                          e.position   = "Required";
    if (!form.hire_date)                                e.hire_date  = "Required";
    if (form.salary === "" || isNaN(form.salary) || Number(form.salary) < 0) e.salary = "Valid amount required";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({ ...form, salary: Number(form.salary), department_id: form.department_id === "" ? null : Number(form.department_id) });
      onClose();
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const F = ({ label, name, type = "text", ...rest }) => (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={form[name]} onChange={e => set(name, e.target.value)} className={errors[name] ? "has-error" : ""} {...rest} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-top">
          <h2 className="modal-title">{employee ? "Edit Employee" : "Add Employee"}</h2>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <F label="First Name"     name="first_name" />
            <F label="Last Name"      name="last_name" />
            <F label="Email"          name="email" type="email" />
            <F label="Phone"          name="phone" type="tel" />
            <F label="Position / Role" name="position" />
            <F label="Hire Date"      name="hire_date" type="date" />
            <F label="Salary (₹)"    name="salary" type="number" min="0" step="1000" />
            <div className="form-group">
              <label>Department</label>
              <select value={form.department_id} onChange={e => set("department_id", e.target.value)}>
                <option value="">No department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Avatar Colour</label>
              <div className="color-row">
                {COLORS.map(c => (
                  <button key={c} type="button" className={`color-swatch ${form.avatar_color === c ? "active" : ""}`}
                    style={{ background: c }} onClick={() => set("avatar_color", c)} />
                ))}
              </div>
            </div>
          </div>
          {errors.general && <p className="field-error general">{errors.general}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-solid" disabled={saving}>{saving ? "Saving…" : employee ? "Save Changes" : "Add Employee"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}