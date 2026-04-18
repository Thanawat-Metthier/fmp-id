import { Static, Type } from "@sinclair/typebox";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { crCiRelations } from "../../../../drizzle/core/relations";
import { crCi } from "../../../../drizzle/core/schema";

// ──────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────

export const CiColorSchemeSchema = Type.Object({
  background: Type.String(),
  foreground: Type.String(),
  primary: Type.String(),
  primaryForeground: Type.String(),
  secondary: Type.String(),
  secondaryForeground: Type.String(),
  muted: Type.String(),
  mutedForeground: Type.String(),
  accent: Type.String(),
  accentForeground: Type.String(),
  destructive: Type.String(),
  destructiveForeground: Type.String(),
});

export type CiColorScheme = Static<typeof CiColorSchemeSchema>;

export const CiObjectSchema = Type.Object({
  logo: Type.String(),
  theme: Type.Object({
    dark: CiColorSchemeSchema,
    light: CiColorSchemeSchema,
  }),
  typography: Type.Object({
    fontFamily: Type.String(),
    fontSize: Type.Number(),
  }),
});

export type CiObject = Static<typeof CiObjectSchema>;

// ──────────────────────────────────────────────
// Type Exports
// ──────────────────────────────────────────────

export const ci = crCi;
export const ciRelations = crCiRelations;

export const selectCiSchema = createSelectSchema(ci, {
  ci: CiObjectSchema
});
export const insertCiSchema = createInsertSchema(ci, {
  ci: CiObjectSchema
});
export const updateCiSchema = createUpdateSchema(ci, {
  ci: CiObjectSchema
});

export type Ci = typeof ci.$inferSelect;
export type SelectCiSchema = Static<typeof selectCiSchema>;
export type InsertCiSchema = Static<typeof insertCiSchema>;
export type UpdateCiSchema = Static<typeof updateCiSchema>;

