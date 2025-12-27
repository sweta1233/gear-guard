import api from "./api";

export const getKanban = async () => {
  const res = await api.get("/maintenance/kanban");
  return res.data;
};

export const createMaintenance = async (data) => {
  return api.post("/maintenance", data);
};

export const updateStatus = async (id, data) => {
  return api.put(`/maintenance/${id}/status`, data);
};

export const assignTechnician = async (id, technician_id) => {
  return api.put(`/maintenance/${id}/assign`, { technician_id });
};

export const getOverdue = async () => {
  const res = await api.get("/maintenance/overdue");
  return res.data;
};

export const getCalendar = async (start, end) => {
  const res = await api.get(
    `/maintenance/calendar/range?start=${start}&end=${end}`
  );
  return res.data;
};
