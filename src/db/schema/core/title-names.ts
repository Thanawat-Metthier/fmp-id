import { Static } from "@sinclair/typebox";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { crTitleNamesRelations } from "../../../../drizzle/core/relations";
import { crTitleNames } from "../../../../drizzle/core/schema";



// ──────────────────────────────────────────────
// Type Exports
// ──────────────────────────────────────────────

export const titleNames = crTitleNames;
export const titleNamesRelations = crTitleNamesRelations;

const selectTitleNameSchema = createSelectSchema(titleNames);
const insertTitleNameSchema = createInsertSchema(titleNames);
const updateTitleNameSchema = createUpdateSchema(titleNames);

export type SelectTitleNameSchema = Static<typeof selectTitleNameSchema>;
export type InsertTitleNameSchema = Static<typeof insertTitleNameSchema>;
export type UpdateTitleNameSchema = Static<typeof updateTitleNameSchema>;
