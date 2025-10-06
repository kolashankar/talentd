import { eq, desc } from "drizzle-orm";
import { db } from "./database";
import * as schema from "@shared/schema";
import { type User, type InsertUser, type Job, type InsertJob, type Roadmap, type InsertRoadmap, type Article, type InsertArticle, type DsaProblem, type InsertDsaProblem, type Portfolio, type InsertPortfolio, type ResumeAnalysis, type InsertResumeAnalysis } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Job operations
  getJobs(category?: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: number): Promise<boolean>;

  // Roadmap operations
  getRoadmaps(): Promise<Roadmap[]>;
  getRoadmap(id: number): Promise<Roadmap | undefined>;
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  updateRoadmap(id: number, roadmap: Partial<InsertRoadmap>): Promise<Roadmap | undefined>;
  deleteRoadmap(id: number): Promise<boolean>;

  // Article operations
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;

  // DSA Problem operations
  getDsaProblems(): Promise<DsaProblem[]>;
  getDsaProblem(id: number): Promise<DsaProblem | undefined>;
  createDsaProblem(problem: InsertDsaProblem): Promise<DsaProblem>;
  updateDsaProblem(id: number, problem: Partial<InsertDsaProblem>): Promise<DsaProblem | undefined>;
  deleteDsaProblem(id: number): Promise<boolean>;

  // Portfolio operations
  getPortfolios(): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  getPortfolioByUserId(userId: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;

  // Resume Analysis operations
  getResumeAnalyses(userId?: number): Promise<ResumeAnalysis[]>;
  getResumeAnalysis(id: number): Promise<ResumeAnalysis | undefined>;
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;
  deleteResumeAnalysis(id: number): Promise<boolean>;
}

export class PostgresStorage implements IStorage {

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(insertUser).returning();
    return result[0];
  }

  // Job operations
  async getJobs(category?: string): Promise<Job[]> {
    let query = db.select().from(schema.jobs).where(eq(schema.jobs.isActive, true));

    if (category) {
      query = query.where(eq(schema.jobs.category, category));
    }

    return query.orderBy(desc(schema.jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const result = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id)).limit(1);
    return result[0];
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const result = await db.insert(schema.jobs).values(insertJob).returning();
    return result[0];
  }

  async updateJob(id: number, updateJob: Partial<InsertJob>): Promise<Job | undefined> {
    const result = await db.update(schema.jobs).set(updateJob).where(eq(schema.jobs.id, id)).returning();
    return result[0];
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await db.delete(schema.jobs).where(eq(schema.jobs.id, id));
    return result.rowCount > 0;
  }

  // Roadmap operations
  async getRoadmaps(): Promise<Roadmap[]> {
    return db.select().from(schema.roadmaps).where(eq(schema.roadmaps.isPublished, true)).orderBy(desc(schema.roadmaps.createdAt));
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    const result = await db.select().from(schema.roadmaps).where(eq(schema.roadmaps.id, id)).limit(1);
    return result[0];
  }

  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const result = await db.insert(schema.roadmaps).values(insertRoadmap).returning();
    return result[0];
  }

  async updateRoadmap(id: number, updateRoadmap: Partial<InsertRoadmap>): Promise<Roadmap | undefined> {
    const result = await db.update(schema.roadmaps).set(updateRoadmap).where(eq(schema.roadmaps.id, id)).returning();
    return result[0];
  }

  async deleteRoadmap(id: number): Promise<boolean> {
    const result = await db.delete(schema.roadmaps).where(eq(schema.roadmaps.id, id));
    return result.rowCount > 0;
  }

  // Article operations
  async getArticles(): Promise<Article[]> {
    return db.select().from(schema.articles).where(eq(schema.articles.isPublished, true)).orderBy(desc(schema.articles.createdAt));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const result = await db.select().from(schema.articles).where(eq(schema.articles.id, id)).limit(1);
    return result[0];
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const result = await db.insert(schema.articles).values(insertArticle).returning();
    return result[0];
  }

  async updateArticle(id: number, updateArticle: Partial<InsertArticle>): Promise<Article | undefined> {
    const result = await db.update(schema.articles).set(updateArticle).where(eq(schema.articles.id, id)).returning();
    return result[0];
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(schema.articles).where(eq(schema.articles.id, id));
    return result.rowCount > 0;
  }

  // DSA Problem operations
  async getDsaProblems(): Promise<DsaProblem[]> {
    return db.select().from(schema.dsaProblems).where(eq(schema.dsaProblems.isPublished, true)).orderBy(desc(schema.dsaProblems.createdAt));
  }

  async getDsaProblem(id: number): Promise<DsaProblem | undefined> {
    const result = await db.select().from(schema.dsaProblems).where(eq(schema.dsaProblems.id, id)).limit(1);
    return result[0];
  }

  async createDsaProblem(insertProblem: InsertDsaProblem): Promise<DsaProblem> {
    const result = await db.insert(schema.dsaProblems).values(insertProblem).returning();
    return result[0];
  }

  async updateDsaProblem(id: number, updateProblem: Partial<InsertDsaProblem>): Promise<DsaProblem | undefined> {
    const result = await db.update(schema.dsaProblems).set(updateProblem).where(eq(schema.dsaProblems.id, id)).returning();
    return result[0];
  }

  async deleteDsaProblem(id: number): Promise<boolean> {
    const result = await db.delete(schema.dsaProblems).where(eq(schema.dsaProblems.id, id));
    return result.rowCount > 0;
  }

  // Portfolio operations
  async getPortfolios(): Promise<Portfolio[]> {
    return db.select().from(schema.portfolios).where(eq(schema.portfolios.isPublic, true)).orderBy(desc(schema.portfolios.createdAt));
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const result = await db.select().from(schema.portfolios).where(eq(schema.portfolios.id, id)).limit(1);
    return result[0];
  }

  async getPortfolioByUserId(userId: number): Promise<Portfolio | undefined> {
    const result = await db.select().from(schema.portfolios).where(eq(schema.portfolios.userId, userId)).limit(1);
    return result[0];
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const result = await db.insert(schema.portfolios).values(insertPortfolio).returning();
    return result[0];
  }

  async updatePortfolio(id: number, updatePortfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const result = await db.update(schema.portfolios).set(updatePortfolio).where(eq(schema.portfolios.id, id)).returning();
    return result[0];
  }

  async deletePortfolio(id: number): Promise<boolean> {
    const result = await db.delete(schema.portfolios).where(eq(schema.portfolios.id, id));
    return result.rowCount > 0;
  }

  // Resume Analysis operations
  async getResumeAnalyses(userId?: number): Promise<ResumeAnalysis[]> {
    let query = db.select().from(schema.resumeAnalyses);

    if (userId) {
      query = query.where(eq(schema.resumeAnalyses.userId, userId));
    }

    return query.orderBy(desc(schema.resumeAnalyses.createdAt));
  }

  async getResumeAnalysis(id: number): Promise<ResumeAnalysis | undefined> {
    const result = await db.select().from(schema.resumeAnalyses).where(eq(schema.resumeAnalyses.id, id)).limit(1);
    return result[0];
  }

  async createResumeAnalysis(insertAnalysis: InsertResumeAnalysis): Promise<ResumeAnalysis> {
    const result = await db.insert(schema.resumeAnalyses).values(insertAnalysis).returning();
    return result[0];
  }

  async deleteResumeAnalysis(id: number): Promise<boolean> {
    const result = await db.delete(schema.resumeAnalyses).where(eq(schema.resumeAnalyses.id, id));
    return result.rowCount > 0;
  }

  // Article interaction methods
  async addLikeToArticle(articleId: string, userId: string): Promise<void> {
    // Implementation for adding likes
    console.log('Adding like to article:', articleId, 'by user:', userId);
  }

  async removeLikeFromArticle(articleId: string, userId: string): Promise<void> {
    // Implementation for removing likes
    console.log('Removing like from article:', articleId, 'by user:', userId);
  }

  async addCommentToArticle(articleId: string, userId: string, comment: string): Promise<any> {
    // Implementation for adding comments
    console.log('Adding comment to article:', articleId, 'by user:', userId, 'comment:', comment);
    return { id: Date.now().toString(), comment, userId, createdAt: new Date() };
  }

  async getCommentsForArticle(articleId: string): Promise<any[]> {
    // Implementation for getting comments
    console.log('Getting comments for article:', articleId);
    return [];
  }

  async incrementShareCountForArticle(articleId: string): Promise<void> {
    // Implementation for incrementing share count
    console.log('Incrementing share count for article:', articleId);
  }

  async incrementDownloadCountForRoadmap(roadmapId: string): Promise<void> {
    // Implementation for incrementing download count
    console.log('Incrementing download count for roadmap:', roadmapId);
  }

  async incrementShareCountForRoadmap(roadmapId: string): Promise<void> {
    // Implementation for incrementing share count
    console.log('Incrementing share count for roadmap:', roadmapId);
  }
}

export const storage = new PostgresStorage();