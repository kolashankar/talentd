CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"author" text NOT NULL,
	"category" varchar(100),
	"tags" json DEFAULT '[]'::json,
	"is_published" boolean DEFAULT true,
	"read_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dsa_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"category" varchar(100) NOT NULL,
	"solution" text,
	"hints" json DEFAULT '[]'::json,
	"time_complexity" text,
	"space_complexity" text,
	"tags" json DEFAULT '[]'::json,
	"companies" json DEFAULT '[]'::json,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"location" text,
	"salary_range" text,
	"job_type" varchar(50) NOT NULL,
	"experience_level" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"skills" json DEFAULT '[]'::json,
	"company_logo" text,
	"application_url" text,
	"is_active" boolean DEFAULT true,
	"category" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"bio" text,
	"email" text NOT NULL,
	"phone" text,
	"location" text,
	"website" text,
	"skills" json DEFAULT '[]'::json,
	"projects" json DEFAULT '[]'::json,
	"experience" json DEFAULT '[]'::json,
	"education" json DEFAULT '[]'::json,
	"resume_url" text,
	"profile_image" text,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"extracted_text" text,
	"analysis_result" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmaps" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"estimated_time" text,
	"technologies" json DEFAULT '[]'::json,
	"steps" json DEFAULT '[]'::json,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_analyses" ADD CONSTRAINT "resume_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;