import { ci, ciRelations } from "./ci";
import { customers, customersRelations } from "./customers";
import { loginRoutes } from "./login-routes";
import { titleNames, titleNamesRelations } from "./title-names";
import { users, usersRelations } from "./users";
import { workspaces, workspacesRelations } from "./workspaces";

export * from "./ci";
export * from "./customers";
export * from "./login-routes";
export * from "./title-names";
export * from "./users";
export * from "./workspaces";

export const schema = {
  // Tables
  ci,
  customers,
  loginRoutes,
  titleNames,
  users,
  workspaces,

  // Relations
  ciRelations,
  customersRelations,
  titleNamesRelations,
  usersRelations,
  workspacesRelations,
};
