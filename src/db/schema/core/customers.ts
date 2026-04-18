import { Static } from "@sinclair/typebox";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-typebox";
import { crCustomersRelations } from "drizzle/core/relations";
import { crCustomers } from "../../../../drizzle/core/schema";



// ──────────────────────────────────────────────
// Type Exports
// ──────────────────────────────────────────────

export const customers = crCustomers;
export const customersRelations = crCustomersRelations;

const selectCustomerSchema = createSelectSchema(customers);
const insertCustomerSchema = createInsertSchema(customers);
const updateCustomerSchema = createUpdateSchema(customers);

export type SelectCustomerSchema = Static<typeof selectCustomerSchema>;
export type InsertCustomerSchema = Static<typeof insertCustomerSchema>;
export type UpdateCustomerSchema = Static<typeof updateCustomerSchema>;

