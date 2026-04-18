import { Static } from "@sinclair/typebox";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { crUsersRelations } from "../../../../drizzle/core/relations";
import { crUsers } from "../../../../drizzle/core/schema";



// ──────────────────────────────────────────────
// Type Exports
// ──────────────────────────────────────────────

export const users = crUsers;
export const usersRelations = crUsersRelations;

const selectUserSchema = createSelectSchema(users);
const insertUserSchema = createInsertSchema(users);
const updateUserSchema = createUpdateSchema(users);

export type SelectUserSchema = Static<typeof selectUserSchema>;
export type InsertUserSchema = Static<typeof insertUserSchema>;
export type UpdateUserSchema = Static<typeof updateUserSchema>;