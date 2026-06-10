import * as userControler from "../user/controller";
import { useMutation } from "@tanstack/react-query";
import type { User } from "../user/model";
import { clearAuthToken } from "../api/client";

export function useRegisterAccount() {
  return useMutation({
    mutationFn: async (user: User) => userControler.registerUser(user),
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => userControler.loginUser(username, password),
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => userControler.logoutUser(),
    onError: (error) => {
      console.error("Logout error:", error);
    },
    onSuccess: () => {
      clearAuthToken();
    },
  });
}
