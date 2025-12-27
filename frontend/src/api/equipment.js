import api from "./api";

export const getEquipment = async () => {
  const res = await api.get("/equipment");
  return res.data;
};

export const createEquipment = async (data) => {
  const res = await api.post("/equipment", data);
  return res.data;
};
