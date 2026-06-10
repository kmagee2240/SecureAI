import type { User } from "../user/model";

export const validateUserShape = (data: User) => {
  return (
    data.email && data.password && data.firstName && data.lastName && data.role
  );
};
