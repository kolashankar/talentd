
import { z } from "zod";
import { pgTable, text, timestamp, boolean, integer, json, varchar, serial } from "drizzle-orm/pg-core";

// Database Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location'),
  salaryRange: text('salary_range'),
  jobType: varchar('job_type', { length: 50 }).notNull(),
  experienceLevel: varchar('experience_level', { length: 50 }).notNull(),
  description: text('description').notNull(),
  requirements: text('requirements'),
  skills: json('skills').$type<string[]>().default([]),
  companyLogo: text('company_logo'),
  applicationUrl: text('application_url'),
  isActive: boolean('is_active').default(true),
  category: varchar('category', { length: 50 }).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  author: text('author').notNull(),
  category: varchar('category', { length: 100 }),
  tags: json('tags').$type<string[]>().default([]),
  isPublished: boolean('is_published').default(true),
  readTime: integer('read_time'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roadmaps = pgTable('roadmaps', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  estimatedTime: text('estimated_time'),
  technologies: json('technologies').$type<string[]>().default([]),
  steps: json('steps').$type<Array<{title: string, description: string, resources: string[]}>>().default([]),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dsaProblems = pgTable('dsa_problems', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  solution: text('solution'),
  hints: json('hints').$type<string[]>().default([]),
  timeComplexity: text('time_complexity'),
  spaceComplexity: text('space_complexity'),
  tags: json('tags').$type<string[]>().default([]),
  companies: json('companies').$type<string[]>().default([]),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  title: text('title').notNull(),
  bio: text('bio'),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
  website: text('website'),
  templateId: varchar('template_id', { length: 50 }),
  skills: json('skills').$type<string[]>().default([]),
  projects: json('projects').$type<Array<{
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
  }>>().default([]),
  experience: json('experience').$type<Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>>().default([]),
  education: json('education').$type<Array<{
    degree: string;
    institution: string;
    year: string;
  }>>().default([]),
  resumeUrl: text('resume_url'),
  profileImage: text('profile_image'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const resumeAnalyses = pgTable('resume_analyses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  atsScore: integer('ats_score'),
  keywordMatches: json('keyword_matches').$type<string[]>().default([]),
  suggestions: json('suggestions').$type<string[]>().default([]),
  formatScore: integer('format_score'),
  readabilityScore: integer('readability_score'),
  analysis: text('analysis'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const solvedProblems = pgTable('solved_problems', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  problemId: integer('problem_id').references(() => dsaProblems.id).notNull(),
  solvedAt: timestamp('solved_at').defaultNow().notNull(),
});

// Zod Schemas (keep existing ones and add types)
export const insertUserSchema = z.object({
  username: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).default('user'),
});

export const insertJobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  jobType: z.enum(['job', 'internship']),
  experienceLevel: z.enum(['fresher', 'experienced']),
  description: z.string().min(1),
  requirements: z.string().optional(),
  skills: z.array(z.string()).default([]),
  companyLogo: z.string().optional(),
  applicationUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  category: z.string().min(1),
  expiresAt: z.string().optional(),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  author: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
  readTime: z.number().optional(),
  expiresAt: z.string().optional(),
});

export const insertRoadmapSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  steps: z.array(z.object({
    title: z.string(),
    description: z.string(),
    resources: z.array(z.string()).default([])
  })).default([]),
  isPublished: z.boolean().default(true),
});

export const insertDsaProblemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.string().min(1),
  solution: z.string().optional(),
  hints: z.array(z.string()).default([]),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  tags: z.array(z.string()).default([]),
  companies: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
});

export const insertPortfolioSchema = z.object({
  userId: z.number(),
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  templateId: z.string().max(50).optional(),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    imageUrl: z.string().url().optional(),
  })).default([]),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })).default([]),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
  })).default([]),
  resumeUrl: z.string().url().optional(),
  profileImage: z.string().url().optional(),
  isPublic: z.boolean().default(true),
});

export const insertResumeAnalysisSchema = z.object({
  userId: z.number().nullable(),
  fileName: z.string().min(1),
  fileUrl: z.string().min(1),
  atsScore: z.number().optional(),
  keywordMatches: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
  formatScore: z.number().optional(),
  readabilityScore: z.number().optional(),
  analysis: z.string().optional(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = typeof roadmaps.$inferInsert;
export type DsaProblem = typeof dsaProblems.$inferSelect;
export type InsertDsaProblem = typeof dsaProblems.$inferInsert;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = typeof portfolios.$inferInsert;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type InsertResumeAnalysis = typeof resumeAnalyses.$inferInsert;
export type SolvedProblem = typeof solvedProblems.$inferSelect;
export type InsertSolvedProblem = typeof solvedProblems.$inferInsert;
