export const isLoggedIn = () => {
  return localStorage.getItem("auth") === "true";
};

export const logout = () => {
  localStorage.removeItem("auth");
};
