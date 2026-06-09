const BASE = "http://localhost:8000";

async function req(path, options = {}) {
  const res  = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export const getEmployees    = (p = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(p).filter(([, v]) => v != null && v !== ""))
  ).toString();
  return req(`/employees${qs ? `?${qs}` : ""}`);
};
export const getEmployee     = (id)      => req(`/employees/${id}`);
export const createEmployee  = (data)    => req("/employees",      { method: "POST",   body: JSON.stringify(data) });
export const updateEmployee  = (id, data)=> req(`/employees/${id}`,{ method: "PUT",    body: JSON.stringify(data) });
export const deleteEmployee  = (id)      => req(`/employees/${id}`,{ method: "DELETE" });
export const getDepartments  = ()        => req("/departments");
export const createDepartment= (data)    => req("/departments",    { method: "POST",   body: JSON.stringify(data) });
export const deleteDepartment= (id)      => req(`/departments/${id}`,{ method: "DELETE" });
export const getStats        = ()        => req("/stats");
export const askChat         = (message) => req("/chat",           { method: "POST",   body: JSON.stringify({ message }) });