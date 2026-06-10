const BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

export const WEBHOOKS = {
  //USER
  REGISTER_ACCOUNT: `${BASE_URL}/register`,
  LOGIN_ACCOUNT: `${BASE_URL}/login`,
  LOGOUT_ACCOUNT: `${BASE_URL}/logout`,
};
