import { z } from "zod";
import { pgTable, text, timestamp, boolean, integer, json, varchar, serial, real, jsonb } from "drizzle-orm/pg-core";

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
  educationLevel: varchar('education_level', { length: 50 }).notNull().default('btech'),
  estimatedTime: text('estimated_time'),
  technologies: json('technologies').$type<string[]>().default([]),
  steps: json('steps').$type<Array<{title: string, description: string, resources: string[]}>>().default([]),
  flowchartData: json('flowchart_data').$type<{
    nodes: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      data: {
        label: string;
        description?: string;
        redirectUrl?: string;
        color?: string;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      type?: string;
      animated?: boolean;
    }>;
  }>(),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  rating: real('rating').default(0),
  ratingCount: integer('rating_count').default(0),
});

export const scholarships = pgTable('scholarships', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  provider: text('provider').notNull(),
  amount: text('amount').notNull(),
  educationLevel: varchar('education_level', { length: 50 }).notNull(),
  eligibility: text('eligibility').notNull(),
  deadline: timestamp('deadline'),
  applicationUrl: text('application_url'),
  category: varchar('category', { length: 100 }),
  tags: json('tags').$type<string[]>().default([]),
  benefits: text('benefits'),
  requirements: text('requirements'),
  howToApply: text('how_to_apply'),
  isActive: boolean('is_active').default(true),
  featured: boolean('featured').default(false),
  expiresAt: timestamp('expires_at'),
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

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  templateId: varchar('template_id', { length: 100 }).notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  version: varchar('version', { length: 20 }).notNull().default('1.0.0'),
  category: varchar('category', { length: 50 }).notNull(),
  thumbnailUrl: text('thumbnail_url'),
  manifestPath: text('manifest_path').notNull(),
  entryFile: text('entry_file').notNull(),
  features: json('features').$type<string[]>().default([]),
  isPremium: boolean('is_premium').default(false),
  isActive: boolean('is_active').default(true),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const portfolioShares = pgTable('portfolio_shares', {
  id: serial('id').primaryKey(),
  shareId: varchar('share_id', { length: 100 }).notNull().unique(),
  portfolioId: integer('portfolio_id').references(() => portfolios.id).notNull(),
  userId: integer('user_id').references(() => users.id),
  templateId: varchar('template_id', { length: 100 }),
  portfolioData: json('portfolio_data').$type<any>(),
  viewCount: integer('view_count').default(0),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roadmapReviews = pgTable('roadmap_reviews', {
  id: serial('id').primaryKey(),
  roadmapId: integer('roadmap_id').references(() => roadmaps.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  review: text('review'),
  isHelpful: boolean('is_helpful').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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

// Assuming createInsertSchema is imported from drizzle-zod
import { createInsertSchema } from "drizzle-zod";

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  rating: z.number().optional().default(0),
  ratingCount: z.number().optional().default(0),
});

export const insertScholarshipSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  provider: z.string().min(1),
  amount: z.string().min(1),
  educationLevel: z.enum(['upto-10th', '12th', 'btech', 'degree', 'postgrad']),
  eligibility: z.string().min(1),
  deadline: z.string().optional(),
  applicationUrl: z.string().url().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  benefits: z.string().optional(),
  requirements: z.string().optional(),
  howToApply: z.string().optional(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  expiresAt: z.string().optional(),
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

export const insertTemplateSchema = z.object({
  templateId: z.string().max(100),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().max(20).default('1.0.0'),
  category: z.string().max(50),
  thumbnailUrl: z.string().optional(),
  manifestPath: z.string(),
  entryFile: z.string(),
  features: z.array(z.string()).default([]),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  uploadedBy: z.number().optional(),
});

export const insertPortfolioShareSchema = z.object({
  shareId: z.string().max(100),
  portfolioId: z.number(),
  userId: z.number().optional(),
  templateId: z.string().max(100).optional(),
  portfolioData: z.any().optional(),
  viewCount: z.number().default(0),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

export const insertRoadmapReviewSchema = z.object({
  roadmapId: z.number(),
  userId: z.number(),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
  isHelpful: z.boolean().default(false),
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
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;
export type PortfolioShare = typeof portfolioShares.$inferSelect;
export type InsertPortfolioShare = typeof portfolioShares.$inferInsert;
export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = typeof scholarships.$inferInsert;
export type RoadmapReview = typeof roadmapReviews.$inferSelect;
export type InsertRoadmapReview = typeof roadmapReviews.$inferInsert;