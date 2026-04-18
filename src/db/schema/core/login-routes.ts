import { Static } from "@sinclair/typebox";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { crLoginRoutes } from "../../../../drizzle/core/schema";



// ──────────────────────────────────────────────
// Type Exports
// ──────────────────────────────────────────────

export const loginRoutes = crLoginRoutes;

export type LoginRoute = typeof loginRoutes.$inferSelect;

const selectLoginRouteSchema = createSelectSchema(loginRoutes);
const insertLoginRouteSchema = createInsertSchema(loginRoutes);
const updateLoginRouteSchema = createUpdateSchema(loginRoutes);

export type SelectLoginRouteSchema = Static<typeof selectLoginRouteSchema>;
export type InsertLoginRouteSchema = Static<typeof insertLoginRouteSchema>;
export type UpdateLoginRouteSchema = Static<typeof updateLoginRouteSchema>;