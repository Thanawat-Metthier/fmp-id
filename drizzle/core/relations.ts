import { relations } from "drizzle-orm/relations";
import { crWorkspaces, crCustomers, crTitleNames, crUsers, crCi } from "./schema";

export const crCustomersRelations = relations(crCustomers, ({one, many}) => ({
	crWorkspace: one(crWorkspaces, {
		fields: [crCustomers.workspaceId],
		references: [crWorkspaces.id]
	}),
	crUsers: many(crUsers),
	crCis: many(crCi),
}));

export const crWorkspacesRelations = relations(crWorkspaces, ({many}) => ({
	crCustomers: many(crCustomers),
	crUsers: many(crUsers),
	crCis: many(crCi),
}));

export const crUsersRelations = relations(crUsers, ({one}) => ({
	crTitleName: one(crTitleNames, {
		fields: [crUsers.titleId],
		references: [crTitleNames.id]
	}),
	crCustomer: one(crCustomers, {
		fields: [crUsers.customerId],
		references: [crCustomers.id]
	}),
	crWorkspace: one(crWorkspaces, {
		fields: [crUsers.workspaceId],
		references: [crWorkspaces.id]
	}),
}));

export const crTitleNamesRelations = relations(crTitleNames, ({many}) => ({
	crUsers: many(crUsers),
}));

export const crCiRelations = relations(crCi, ({one}) => ({
	crWorkspace: one(crWorkspaces, {
		fields: [crCi.workspaceId],
		references: [crWorkspaces.id]
	}),
	crCustomer: one(crCustomers, {
		fields: [crCi.customerId],
		references: [crCustomers.id]
	}),
}));