import { Static } from "@sinclair/typebox";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { crWorkspacesRelations } from "../../../../drizzle/core/relations";
import { crWorkspaces } from "../../../../drizzle/core/schema";



// ──────────────────────────────────────────────
// Type Exports
// ──────────────────────────────────────────────

export const workspaces = crWorkspaces;
export const workspacesRelations = crWorkspacesRelations;

const selectWorkspaceSchema = createSelectSchema(workspaces);
const insertWorkspaceSchema = createInsertSchema(workspaces);
const updateWorkspaceSchema = createUpdateSchema(workspaces);

export type SelectWorkspaceSchema = Static<typeof selectWorkspaceSchema>;
export type InsertWorkspaceSchema = Static<typeof insertWorkspaceSchema>;
export type UpdateWorkspaceSchema = Static<typeof updateWorkspaceSchema>;

