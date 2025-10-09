CREATE TABLE "dsa_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"problem_count" integer DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dsa_companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sheet_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"sheet_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"order" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dsa_sheets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"creator" text NOT NULL,
	"type" varchar(50) DEFAULT 'public' NOT NULL,
	"problem_count" integer DEFAULT 0,
	"follower_count" integer DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dsa_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"difficulty" varchar(50) NOT NULL,
	"problem_count" integer DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dsa_topics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "problem_companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"problem_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "problem_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"problem_id" integer NOT NULL,
	"topic_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "dsa_problems" RENAME COLUMN "companies" TO "status";--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "hints" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "hints" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "time_complexity" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "space_complexity" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "tags" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "tags" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "dsa_problems" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "dsa_problems" ADD COLUMN "leetcode_url" varchar(500);--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "flowchart_image" text;--> statement-breakpoint
ALTER TABLE "sheet_problems" ADD CONSTRAINT "sheet_problems_sheet_id_dsa_sheets_id_fk" FOREIGN KEY ("sheet_id") REFERENCES "public"."dsa_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sheet_problems" ADD CONSTRAINT "sheet_problems_problem_id_dsa_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."dsa_problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_companies" ADD CONSTRAINT "problem_companies_problem_id_dsa_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."dsa_problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_companies" ADD CONSTRAINT "problem_companies_company_id_dsa_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."dsa_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_topics" ADD CONSTRAINT "problem_topics_problem_id_dsa_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."dsa_problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_topics" ADD CONSTRAINT "problem_topics_topic_id_dsa_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."dsa_topics"("id") ON DELETE cascade ON UPDATE no action;