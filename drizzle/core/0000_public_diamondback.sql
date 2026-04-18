-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SEQUENCE "public"."cr_customer_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."cr_workspace_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "cr_title_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"th_name" varchar(255) NOT NULL,
	"en_name" varchar(255),
	"short_name" varchar(50),
	"seq" integer,
	"ref_1" varchar(255),
	"ref_2" varchar(255),
	"created_at" timestamp with time zone,
	"created_by" varchar(255),
	"updated_at" timestamp with time zone,
	"updated_by" varchar(255),
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(255),
	"mapping" varchar(255),
	"start_date" date NOT NULL,
	"end_date" date,
	"is_active" boolean DEFAULT true,
	"insert_by" varchar(255),
	CONSTRAINT "cr_title_names_uq" UNIQUE("th_name")
);
--> statement-breakpoint
CREATE TABLE "cr_customers" (
	"id" integer PRIMARY KEY DEFAULT nextval('cr_customer_id_seq'::regclass) NOT NULL,
	"th_name" varchar(255) NOT NULL,
	"en_name" varchar(255),
	"short_name" varchar(50),
	"seq" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_at" timestamp with time zone,
	"updated_by" varchar(255),
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(255),
	"workspace" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"start_date" date,
	"end_date" date,
	"is_active" boolean DEFAULT true,
	"insert_by" varchar(255),
	"sale_order_prefix" varchar(30),
	"sale_order_year_no" integer,
	"sale_order_month_no" integer,
	"sale_order_next_monthly_run_no" integer,
	"sale_order_next_yearly_run_no" integer,
	"sale_order_run_no_digit" integer,
	"sale_order_run_no_type" varchar(30),
	"sale_order_delimiter" varchar(30),
	"bill_address" text,
	"uuid" uuid,
	"workspace_id" integer,
	CONSTRAINT "cr_customers_uq" UNIQUE("workspace","code")
);
--> statement-breakpoint
CREATE TABLE "cr_workspaces" (
	"id" integer PRIMARY KEY DEFAULT nextval('cr_workspace_id_seq'::regclass) NOT NULL,
	"code" varchar(255) NOT NULL,
	"th_name" varchar(255) NOT NULL,
	"en_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255),
	"updated_at" timestamp with time zone,
	"updated_by" varchar(255),
	"insert_by" varchar(255),
	"description" text,
	"uuid" uuid NOT NULL,
	"is_active" boolean,
	CONSTRAINT "cr_workspaces_uq" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "cr_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar(50) NOT NULL,
	"password" varchar(50),
	"user_type" varchar(30) NOT NULL,
	"workspace" varchar(255),
	"customer_id" integer,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255),
	"employee_code" varchar(30),
	"email" varchar(255),
	"phone_numer" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_at" timestamp with time zone,
	"updated_by" varchar(255),
	"insert_by" varchar(255),
	"title_id" integer,
	"uuid" uuid NOT NULL,
	"def_language" varchar(30) DEFAULT 'TH',
	"def_fontsize" varchar(30) DEFAULT 'S',
	"def_display" varchar(30) DEFAULT 'L',
	"workspace_id" integer,
	"customer" varchar(255),
	CONSTRAINT "cr_users_uq" UNIQUE("user_name","workspace","customer")
);
--> statement-breakpoint
CREATE TABLE "cr_ci" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace" varchar(255),
	"customer" varchar(255),
	"ci" jsonb,
	"workspace_id" integer,
	"customer_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255),
	"updated_at" timestamp with time zone,
	"updated_by" varchar(255),
	"deleted_by" varchar(255),
	"deleted_at" timestamp with time zone,
	"insert_by" varchar(255),
	"uuid" uuid,
	CONSTRAINT "cr_ci_uq" UNIQUE("workspace","customer")
);
--> statement-breakpoint
ALTER TABLE "cr_customers" ADD CONSTRAINT "cr_customers_cr_workspaces_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."cr_workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cr_users" ADD CONSTRAINT "cr_users_cr_title_names_fk" FOREIGN KEY ("title_id") REFERENCES "public"."cr_title_names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cr_users" ADD CONSTRAINT "cr_users_cr_customers_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."cr_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cr_users" ADD CONSTRAINT "cr_users_cr_workspaces_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."cr_workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cr_ci" ADD CONSTRAINT "cr_ci_cr_workspaces_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."cr_workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cr_ci" ADD CONSTRAINT "cr_ci_cr_customers_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."cr_customers"("id") ON DELETE no action ON UPDATE no action;
*/