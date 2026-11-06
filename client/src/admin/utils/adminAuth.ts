export const getAdminAuthConfig = () => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};
