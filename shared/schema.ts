import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"), // 'admin' or 'user'
  createdAt: timestamp("created_at").defaultNow(),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salaryRange: text("salary_range"),
  jobType: text("job_type").notNull(), // 'full-time', 'part-time', 'internship', 'contract'
  experienceLevel: text("experience_level").notNull(), // 'fresher', 'entry', 'junior'
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  skills: json("skills").$type<string[]>().default([]),
  companyLogo: text("company_logo"),
  companyWebsite: text("company_website"),
  applicationUrl: text("application_url"),
  sourceUrl: text("source_url"),
  benefits: text("benefits"),
  responsibilities: text("responsibilities"),
  isActive: boolean("is_active").default(true),
  category: text("category").notNull().default("job"), // 'job', 'fresher-job', 'internship'
  createdAt: timestamp("created_at").defaultNow(),
});

// Roadmaps table
export const roadmaps = pgTable("roadmaps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  estimatedTime: text("estimated_time"),
  technologies: json("technologies").$type<string[]>().default([]),
  steps: json("steps").$type<{title: string, description: string, resources: string[]}[]>().default([]),
  image: text("image"),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Articles table
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  featuredImage: text("featured_image"),
  isPublished: boolean("is_published").default(true),
  readTime: integer("read_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// DSA Problems table
export const dsaProblems = pgTable("dsa_problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard'
  category: text("category").notNull(), // 'array', 'string', 'tree', etc.
  solution: text("solution").notNull(),
  hints: json("hints").$type<string[]>().default([]),
  timeComplexity: text("time_complexity"),
  spaceComplexity: text("space_complexity"),
  tags: json("tags").$type<string[]>().default([]),
  companies: json("companies").$type<string[]>().default([]),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Portfolios table
export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website"),
  linkedin: text("linkedin"),
  github: text("github"),
  profileImage: text("profile_image"),
  resumeUrl: text("resume_url"),
  projects: json("projects").$type<{
    title: string;
    description: string;
    technologies: string[];
    demoUrl?: string;
    githubUrl?: string;
    image?: string;
  }[]>().default([]),
  skills: json("skills").$type<string[]>().default([]),
  experience: json("experience").$type<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }[]>().default([]),
  education: json("education").$type<{
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }[]>().default([]),
  isPublic: boolean("is_public").default(false),
  customDomain: text("custom_domain"),
  theme: text("theme").default("default"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resume Analysis table
export const resumeAnalyses = pgTable("resume_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  filename: text("filename").notNull(),
  fileUrl: text("file_url").notNull(),
  atsScore: integer("ats_score").notNull(),
  keywordMatches: json("keyword_matches").$type<{
    matched: string[];
    missing: string[];
    total: number;
  }>(),
  suggestions: json("suggestions").$type<string[]>().default([]),
  formatScore: text("format_score").notNull(),
  readabilityScore: text("readability_score").notNull(),
  analysis: text("analysis").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
});

export const insertDsaProblemSchema = createInsertSchema(dsaProblems).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
});

export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type DsaProblem = typeof dsaProblems.$inferSelect;
export type InsertDsaProblem = z.infer<typeof insertDsaProblemSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;