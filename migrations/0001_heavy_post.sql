CREATE TABLE "portfolio_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"share_id" varchar(100) NOT NULL,
	"portfolio_id" integer NOT NULL,
	"user_id" integer,
	"template_id" varchar(100),
	"portfolio_data" json,
	"view_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_shares_share_id_unique" UNIQUE("share_id")
);
--> statement-breakpoint
CREATE TABLE "roadmap_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"roadmap_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"is_helpful" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scholarships" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"provider" text NOT NULL,
	"amount" text NOT NULL,
	"education_level" varchar(50) NOT NULL,
	"eligibility" text NOT NULL,
	"deadline" timestamp,
	"application_url" text,
	"category" varchar(100),
	"tags" json DEFAULT '[]'::json,
	"benefits" text,
	"requirements" text,
	"how_to_apply" text,
	"is_active" boolean DEFAULT true,
	"featured" boolean DEFAULT false,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solved_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	"solved_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" varchar(100) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"version" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"category" varchar(50) NOT NULL,
	"thumbnail_url" text,
	"manifest_path" text NOT NULL,
	"entry_file" text NOT NULL,
	"features" json DEFAULT '[]'::json,
	"is_premium" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"uploaded_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "templates_template_id_unique" UNIQUE("template_id")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "portfolios" ADD COLUMN "template_id" varchar(50);--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "education_level" varchar(50) DEFAULT 'btech' NOT NULL;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "flowchart_data" json;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "rating" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "rating_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "portfolio_shares" ADD CONSTRAINT "portfolio_shares_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_shares" ADD CONSTRAINT "portfolio_shares_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_reviews" ADD CONSTRAINT "roadmap_reviews_roadmap_id_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_reviews" ADD CONSTRAINT "roadmap_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solved_problems" ADD CONSTRAINT "solved_problems_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solved_problems" ADD CONSTRAINT "solved_problems_problem_id_dsa_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."dsa_problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;