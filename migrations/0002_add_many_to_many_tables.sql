
-- Create many-to-many relationship tables for DSA problems

CREATE TABLE IF NOT EXISTS "problem_topics" (
  "id" serial PRIMARY KEY NOT NULL,
  "problem_id" integer NOT NULL,
  "topic_id" integer NOT NULL,
  "created_at" timestamp DEFAULT now(),
  FOREIGN KEY ("problem_id") REFERENCES "dsa_problems"("id") ON DELETE CASCADE,
  FOREIGN KEY ("topic_id") REFERENCES "dsa_topics"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "problem_companies" (
  "id" serial PRIMARY KEY NOT NULL,
  "problem_id" integer NOT NULL,
  "company_id" integer NOT NULL,
  "created_at" timestamp DEFAULT now(),
  FOREIGN KEY ("problem_id") REFERENCES "dsa_problems"("id") ON DELETE CASCADE,
  FOREIGN KEY ("company_id") REFERENCES "dsa_companies"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "sheet_problems" (
  "id" serial PRIMARY KEY NOT NULL,
  "sheet_id" integer NOT NULL,
  "problem_id" integer NOT NULL,
  "order" integer,
  "created_at" timestamp DEFAULT now(),
  FOREIGN KEY ("sheet_id") REFERENCES "dsa_sheets"("id") ON DELETE CASCADE,
  FOREIGN KEY ("problem_id") REFERENCES "dsa_problems"("id") ON DELETE CASCADE
);

-- Remove old single-reference columns from dsa_problems (optional, for clean migration)
-- ALTER TABLE "dsa_problems" DROP COLUMN IF EXISTS "topic_id";
-- ALTER TABLE "dsa_problems" DROP COLUMN IF EXISTS "company_id";
