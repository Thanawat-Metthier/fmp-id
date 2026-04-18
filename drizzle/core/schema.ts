import { pgTable, unique, serial, varchar, integer, timestamp, date, boolean, foreignKey, text, uuid, jsonb, pgSequence } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const crCustomerIdSeq = pgSequence("cr_customer_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })
export const crWorkspaceIdSeq = pgSequence("cr_workspace_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const crTitleNames = pgTable("cr_title_names", {
	id: serial().primaryKey().notNull(),
	thName: varchar("th_name", { length: 255 }).notNull(),
	enName: varchar("en_name", { length: 255 }),
	shortName: varchar("short_name", { length: 50 }),
	seq: integer(),
	ref1: varchar("ref_1", { length: 255 }),
	ref2: varchar("ref_2", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	createdBy: varchar("created_by", { length: 255 }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	updatedBy: varchar("updated_by", { length: 255 }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	deletedBy: varchar("deleted_by", { length: 255 }),
	mapping: varchar({ length: 255 }),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	isActive: boolean("is_active").default(true),
	insertBy: varchar("insert_by", { length: 255 }),
}, (table) => [
	unique("cr_title_names_uq").on(table.thName),
]);

export const crCustomers = pgTable("cr_customers", {
	id: integer().default(sql`nextval('cr_customer_id_seq'::regclass)`).primaryKey().notNull(),
	thName: varchar("th_name", { length: 255 }).notNull(),
	enName: varchar("en_name", { length: 255 }),
	shortName: varchar("short_name", { length: 50 }),
	seq: integer(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar("created_by", { length: 255 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	updatedBy: varchar("updated_by", { length: 255 }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	deletedBy: varchar("deleted_by", { length: 255 }),
	workspace: varchar({ length: 255 }).notNull(),
	code: varchar({ length: 255 }).notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	isActive: boolean("is_active").default(true),
	insertBy: varchar("insert_by", { length: 255 }),
	saleOrderPrefix: varchar("sale_order_prefix", { length: 30 }),
	saleOrderYearNo: integer("sale_order_year_no"),
	saleOrderMonthNo: integer("sale_order_month_no"),
	saleOrderNextMonthlyRunNo: integer("sale_order_next_monthly_run_no"),
	saleOrderNextYearlyRunNo: integer("sale_order_next_yearly_run_no"),
	saleOrderRunNoDigit: integer("sale_order_run_no_digit"),
	saleOrderRunNoType: varchar("sale_order_run_no_type", { length: 30 }),
	saleOrderDelimiter: varchar("sale_order_delimiter", { length: 30 }),
	billAddress: text("bill_address"),
	uuid: uuid(),
	workspaceId: integer("workspace_id"),
}, (table) => [
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [crWorkspaces.id],
			name: "cr_customers_cr_workspaces_fk"
		}),
	unique("cr_customers_uq").on(table.workspace, table.code),
]);

export const crWorkspaces = pgTable("cr_workspaces", {
	id: integer().default(sql`nextval('cr_workspace_id_seq'::regclass)`).primaryKey().notNull(),
	code: varchar({ length: 255 }).notNull(),
	thName: varchar("th_name", { length: 255 }).notNull(),
	enName: varchar("en_name", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar("created_by", { length: 255 }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	updatedBy: varchar("updated_by", { length: 255 }),
	insertBy: varchar("insert_by", { length: 255 }),
	description: text(),
	uuid: uuid().notNull(),
	isActive: boolean("is_active"),
}, (table) => [
	unique("cr_workspaces_uq").on(table.code),
]);

export const crUsers = pgTable("cr_users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	password: varchar({ length: 50 }),
	userType: varchar("user_type", { length: 30 }).notNull(),
	workspace: varchar({ length: 255 }),
	customerId: integer("customer_id"),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }),
	employeeCode: varchar("employee_code", { length: 30 }),
	email: varchar({ length: 255 }),
	phoneNumber: varchar("phone_number", { length: 255 }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdBy: varchar("created_by", { length: 255 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	updatedBy: varchar("updated_by", { length: 255 }),
	insertBy: varchar("insert_by", { length: 255 }),
	titleId: integer("title_id"),
	uuid: uuid().notNull(),
	defLanguage: varchar("def_language", { length: 30 }).default('TH'),
	defFontsize: varchar("def_fontsize", { length: 30 }).default('S'),
	defDisplay: varchar("def_display", { length: 30 }).default('L'),
	workspaceId: integer("workspace_id"),
	customer: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.titleId],
			foreignColumns: [crTitleNames.id],
			name: "cr_users_cr_title_names_fk"
		}),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [crCustomers.id],
			name: "cr_users_cr_customers_fk"
		}),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [crWorkspaces.id],
			name: "cr_users_cr_workspaces_fk"
		}),
	unique("cr_users_uq").on(table.username, table.workspace, table.customer),
]);

export const crCi = pgTable("cr_ci", {
	id: serial().primaryKey().notNull(),
	workspace: varchar({ length: 255 }),
	customer: varchar({ length: 255 }),
	ci: jsonb(),
	workspaceId: integer("workspace_id"),
	customerId: integer("customer_id"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: varchar("created_by", { length: 255 }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	updatedBy: varchar("updated_by", { length: 255 }),
	deletedBy: varchar("deleted_by", { length: 255 }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	insertBy: varchar("insert_by", { length: 255 }),
	uuid: uuid(),
}, (table) => [
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [crWorkspaces.id],
			name: "cr_ci_cr_workspaces_fk"
		}),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [crCustomers.id],
			name: "cr_ci_cr_customers_fk"
		}),
	unique("cr_ci_uq").on(table.workspace, table.customer),
]);

export const crLoginRoutes = pgTable("cr_login_routes", {
	id: serial().primaryKey().notNull(),
	path: varchar({ length: 255 }).notNull(),
	workspaceId: integer("workspace_id"),
	workspace: varchar({ length: 255 }),
	customerId: integer("customer_id"),
	customer: varchar({ length: 255 }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	createdBy: varchar("created_by", { length: 255 }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	updatedBy: varchar("updated_by", { length: 255 }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	deletedBy: varchar("deleted_by", { length: 255 }),
});
