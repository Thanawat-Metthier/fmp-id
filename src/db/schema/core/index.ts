import { ci, ciRelations } from "./ci";
import { loginRoutes } from "./login-routes";
import { users, usersRelations } from "./users";

export * from "./ci";
export * from "./login-routes";
export * from "./users";

export const schema = {
  // Tables
  ci,
  loginRoutes,
  users,

  // Relations
  ciRelations,
  usersRelations,
};
