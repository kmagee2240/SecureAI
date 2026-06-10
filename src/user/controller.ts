import type { AuthResponse } from "./authmodel";
import type { User } from "./model";
import * as userService from "./service";
import { validateUserShape } from "../helper";
import { clearAuthToken } from "../api/client";
import { loginSchema, registerSchema } from "./validation";

const loginAttempts = { count: 0, lockedUntil: 0 };
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000; // 15 minutes

export async function registerUser(user: User): Promise<AuthResponse> {
  //zod validation
  const parsedResult = registerSchema.safeParse(user);
  if (!parsedResult.success) {
    return { success: false, message: "Invalid user data" };
  }

  if (!validateUserShape(user)) {
    return { success: false, message: "Invalid user data" };
  }
  const res = await userService.register(parsedResult.data);

  if (res.csrfToken) {
    sessionStorage.setItem("csrfToken", res.csrfToken);
  }

  return res;
}

export async function loginUser(
  username: string,
  password: string,
): Promise<AuthResponse> {
  //Rate limit check
  const now = Date.now();
  if (loginAttempts.lockedUntil > now) {
    return {
      success: false,
      message: `Too many attempts. Try again in ${Math.ceil(
        (loginAttempts.lockedUntil - now) / 1000,
      )} seconds.`,
    };
  }

  //zod validation
  const parsedResult = loginSchema.safeParse({ username, password });
  if (!parsedResult.success) {
    return { success: false, message: "Invalid login data" };
  }

  const res = await userService.login(username, password);

  if (!res.success) {
    loginAttempts.count++;
    if (loginAttempts.count >= MAX_ATTEMPTS) {
      loginAttempts.lockedUntil = Date.now() + LOCKOUT_MS;
      loginAttempts.count = 0; // reset count after lockout
      return {
        success: false,
        message: `Too many attempts. Try again in ${LOCKOUT_MS / 1000} seconds.`,
      };
    }
    return res;
  }

  loginAttempts.count = 0; // reset on successful login
  loginAttempts.lockedUntil = 0;

  if (res.csrfToken) {
    sessionStorage.setItem("csrfToken", res.csrfToken);
  }

  return res;
}

export async function logoutUser(): Promise<AuthResponse> {
  const res = await userService.logout();

  if (res.success) {
    sessionStorage.removeItem("csrfToken");
    clearAuthToken();
  }

  return res;
}
