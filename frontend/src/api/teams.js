import api from "./api";

export const getTeams = async () => {
  const res = await api.get("/teams");
  return res.data;
};

export const createTeam = async (name) => {
  const res = await api.post("/teams", { name });
  return res.data;
};

export const addMember = async (teamId, userId) => {
  return api.post(`/teams/${teamId}/members?user_id=${userId}`);
};
