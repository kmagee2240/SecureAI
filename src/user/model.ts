export type Role = "admin" | "user" | "guest";

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export const UserModal = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "user",
};
