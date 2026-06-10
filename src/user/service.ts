/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient, { setAuthToken } from "../api/client";
import type { AuthResponse } from "./authmodel";
import type { User } from "./model";
import { WEBHOOKS } from "../api/webhook";

const getCsrfToken = (): string => sessionStorage.getItem("csrfToken") || "";

const WEBHOOK_SECRET = import.meta.env.REACT_APP_WEBHOOK_SECRET ?? ""; // move to env before production

export async function register(user: User): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      WEBHOOKS.REGISTER_ACCOUNT,
      user,
      {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
          "X-Webhook-Secret": WEBHOOK_SECRET,
        },
      },
    );
    return response.data;
  } catch (error) {
    return { success: false, message: "Registration failed" };
  }
}

export async function login(
  username: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      WEBHOOKS.LOGIN_ACCOUNT,
      { email: username, password },
      {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
          "X-Webhook-Secret": WEBHOOK_SECRET,
        },
      },
    );

    if (response.data.success && response.data.csrfToken) {
      setAuthToken(response.data.csrfToken);
    }
    return response.data;
  } catch (error) {
    return { success: false, message: "Login failed" };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      WEBHOOKS.LOGOUT_ACCOUNT,
      {},
      {
        headers: {
          "X-CSRF-Token": getCsrfToken(),
          "X-Webhook-Secret": WEBHOOK_SECRET,
        },
      },
    );
    return response.data;
  } catch (error) {
    return { success: false, message: "Logout failed" };
  }
}
