import { eq, desc, and } from "drizzle-orm";
import { db } from "./database";
import * as schema from "@shared/schema";
import {
  type User,
  type InsertUser,
  type Job,
  type InsertJob,
  type Roadmap,
  type InsertRoadmap,
  type Article,
  type InsertArticle,
  type DsaProblem,
  type InsertDsaProblem,
  type DsaTopic,
  type InsertDsaTopic,
  type DsaCompany,
  type InsertDsaCompany,
  type DsaSheet,
  type InsertDsaSheet,
  type DsaSheetProblem,
  type InsertDsaSheetProblem,
  type Portfolio,
  type InsertPortfolio,
  type ResumeAnalysis,
  type InsertResumeAnalysis,
  type Scholarship,
  type InsertScholarship,
} from "@shared/schema";
import {
  users,
  jobs,
  articles,
  roadmaps,
  dsaProblems,
  dsaTopics,
  dsaCompanies,
  dsaSheets,
  dsaSheetProblems,
  portfolios,
  resumeAnalyses,
  solvedProblems,
  templates,
  portfolioShares,
  scholarships,
  roadmapReviews,
} from "@shared/schema";

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
  updateRoadmap(
    id: number,
    roadmap: Partial<InsertRoadmap>,
  ): Promise<Roadmap | undefined>;
  deleteRoadmap(id: number): Promise<boolean>;

  // Roadmap Review operations
  createRoadmapReview(data: any): Promise<any>;
  getRoadmapReviews(roadmapId: number): Promise<any[]>;
  deleteRoadmapReview(
    reviewId: number,
    userId: number,
  ): Promise<any | undefined>;

  // Article operations
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(
    id: number,
    article: Partial<InsertArticle>,
  ): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;

  // DSA Problem operations
  getDsaProblems(): Promise<DsaProblem[]>;
  getDsaProblem(id: number): Promise<DsaProblem | undefined>;
  createDsaProblem(problem: InsertDsaProblem): Promise<DsaProblem>;
  updateDsaProblem(
    id: number,
    problem: Partial<InsertDsaProblem>,
  ): Promise<DsaProblem | undefined>;
  deleteDsaProblem(id: number): Promise<boolean>;
  markProblemAsSolved(userId: number, problemId: number): Promise<boolean>;
  isProblemSolved(userId: number, problemId: number): Promise<boolean>;

  // Portfolio operations
  getPortfolios(): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  getPortfolioByUserId(userId: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(
    id: number,
    portfolio: Partial<InsertPortfolio>,
  ): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;

  // Resume Analysis operations
  getResumeAnalyses(userId?: number): Promise<ResumeAnalysis[]>;
  getResumeAnalysis(id: number): Promise<ResumeAnalysis | undefined>;
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;
  deleteResumeAnalysis(id: number): Promise<boolean>;

  // Scholarship operations
  getScholarships(educationLevel?: string): Promise<Scholarship[]>;
  getScholarship(id: number): Promise<Scholarship | undefined>;
  createScholarship(data: InsertScholarship): Promise<Scholarship>;
  updateScholarship(
    id: number,
    data: Partial<InsertScholarship>,
  ): Promise<Scholarship | undefined>;
  deleteScholarship(id: number): Promise<boolean>;

  // DSA Topics operations
  getDsaTopics(): Promise<DsaTopic[]>;
  getDsaTopic(id: number): Promise<DsaTopic | undefined>;
  createDsaTopic(topic: InsertDsaTopic): Promise<DsaTopic>;
  updateDsaTopic(
    id: number,
    topic: Partial<InsertDsaTopic>,
  ): Promise<DsaTopic | undefined>;
  deleteDsaTopic(id: number): Promise<boolean>;

  // DSA Companies operations
  getDsaCompanies(): Promise<DsaCompany[]>;
  getDsaCompany(id: number): Promise<DsaCompany | undefined>;
  createDsaCompany(company: InsertDsaCompany): Promise<DsaCompany>;
  updateDsaCompany(
    id: number,
    company: Partial<InsertDsaCompany>,
  ): Promise<DsaCompany | undefined>;
  deleteDsaCompany(id: number): Promise<boolean>;

  // DSA Sheets operations
  getDsaSheets(): Promise<DsaSheet[]>;
  getDsaSheet(id: number): Promise<DsaSheet | undefined>;
  createDsaSheet(sheet: InsertDsaSheet): Promise<DsaSheet>;
  updateDsaSheet(
    id: number,
    sheet: Partial<InsertDsaSheet>,
  ): Promise<DsaSheet | undefined>;
  deleteDsaSheet(id: number): Promise<boolean>;

  // DSA Sheet Problems operations
  getDsaSheetProblems(sheetId: number): Promise<DsaSheetProblem[]>;
  addProblemToSheet(data: InsertDsaSheetProblem): Promise<DsaSheetProblem>;
  removeProblemFromSheet(id: number): Promise<boolean>;
}

export class PostgresStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(insertUser).returning();
    return result[0];
  }

  // Job operations
  async getJobs(category?: string): Promise<Job[]> {
    if (category) {
      return db
        .select()
        .from(schema.jobs)
        .where(
          and(
            eq(schema.jobs.isActive, true),
            eq(schema.jobs.category, category),
          ),
        )
        .orderBy(desc(schema.jobs.createdAt));
    }

    return db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.isActive, true))
      .orderBy(desc(schema.jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const result = await db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.id, id))
      .limit(1);
    return result[0];
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const result = await db.insert(schema.jobs).values(insertJob).returning();
    return result[0];
  }

  async updateJob(
    id: number,
    updateJob: Partial<InsertJob>,
  ): Promise<Job | undefined> {
    const result = await db
      .update(schema.jobs)
      .set(updateJob)
      .where(eq(schema.jobs.id, id))
      .returning();
    return result[0];
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await db.delete(schema.jobs).where(eq(schema.jobs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Roadmap operations
  async getRoadmaps(): Promise<Roadmap[]> {
    return db
      .select()
      .from(schema.roadmaps)
      .where(eq(schema.roadmaps.isPublished, true))
      .orderBy(desc(schema.roadmaps.createdAt));
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    const result = await db
      .select()
      .from(schema.roadmaps)
      .where(eq(schema.roadmaps.id, id))
      .limit(1);
    return result[0];
  }

  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const result = await db
      .insert(schema.roadmaps)
      .values(insertRoadmap)
      .returning();
    return result[0];
  }

  async updateRoadmap(
    id: number,
    updateRoadmap: Partial<InsertRoadmap>,
  ): Promise<Roadmap | undefined> {
    const result = await db
      .update(schema.roadmaps)
      .set(updateRoadmap)
      .where(eq(schema.roadmaps.id, id))
      .returning();
    return result[0];
  }

  async deleteRoadmap(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.roadmaps)
      .where(eq(schema.roadmaps.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Article operations
  async getArticles(): Promise<Article[]> {
    return db
      .select()
      .from(schema.articles)
      .where(eq(schema.articles.isPublished, true))
      .orderBy(desc(schema.articles.createdAt));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const result = await db
      .select()
      .from(schema.articles)
      .where(eq(schema.articles.id, id))
      .limit(1);
    return result[0];
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const result = await db
      .insert(schema.articles)
      .values(insertArticle)
      .returning();
    return result[0];
  }

  async updateArticle(
    id: number,
    updateArticle: Partial<InsertArticle>,
  ): Promise<Article | undefined> {
    const result = await db
      .update(schema.articles)
      .set(updateArticle)
      .where(eq(schema.articles.id, id))
      .returning();
    return result[0];
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.articles)
      .where(eq(schema.articles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // DSA Problem operations
  async getDsaProblems(): Promise<DsaProblem[]> {
    return db
      .select()
      .from(schema.dsaProblems)
      .where(eq(schema.dsaProblems.isPublished, true))
      .orderBy(desc(schema.dsaProblems.createdAt));
  }

  async getDsaProblem(id: number): Promise<DsaProblem | undefined> {
    const result = await db
      .select()
      .from(schema.dsaProblems)
      .where(eq(schema.dsaProblems.id, id))
      .limit(1);
    return result[0];
  }

  async createDsaProblem(insertProblem: InsertDsaProblem): Promise<DsaProblem> {
    const result = await db
      .insert(schema.dsaProblems)
      .values(insertProblem)
      .returning();
    return result[0];
  }

  async updateDsaProblem(
    id: number,
    updateProblem: Partial<InsertDsaProblem>,
  ): Promise<DsaProblem | undefined> {
    const result = await db
      .update(schema.dsaProblems)
      .set(updateProblem)
      .where(eq(schema.dsaProblems.id, id))
      .returning();
    return result[0];
  }

  async deleteDsaProblem(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.dsaProblems)
      .where(eq(schema.dsaProblems.id, id))
      .returning();
    return result.length > 0;
  }

  async markProblemAsSolved(
    userId: number,
    problemId: number,
  ): Promise<boolean> {
    try {
      // Check if already solved
      const existing = await db
        .select()
        .from(schema.solvedProblems)
        .where(
          and(
            eq(schema.solvedProblems.userId, userId),
            eq(schema.solvedProblems.problemId, problemId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return true; // Already marked as solved
      }

      // Mark as solved
      await db.insert(schema.solvedProblems).values({
        userId,
        problemId,
      });
      return true;
    } catch (error) {
      console.error("Error marking problem as solved:", error);
      return false;
    }
  }

  async isProblemSolved(userId: number, problemId: number): Promise<boolean> {
    const [result] = await db
      .select()
      .from(solvedProblems)
      .where(
        and(
          eq(solvedProblems.userId, userId),
          eq(solvedProblems.problemId, problemId),
        ),
      )
      .limit(1);

    return !!result;
  }

  async createRoadmapReview(data: any): Promise<any> {
    const [review] = await db.insert(roadmapReviews).values(data).returning();
    return review;
  }

  async getRoadmapReviews(roadmapId: number): Promise<any[]> {
    const reviews = await db
      .select({
        id: roadmapReviews.id,
        roadmapId: roadmapReviews.roadmapId,
        userId: roadmapReviews.userId,
        rating: roadmapReviews.rating,
        review: roadmapReviews.review,
        isHelpful: roadmapReviews.isHelpful,
        createdAt: roadmapReviews.createdAt,
        username: users.username,
        profileImage: users.profileImage,
      })
      .from(roadmapReviews)
      .leftJoin(users, eq(roadmapReviews.userId, users.id))
      .where(eq(roadmapReviews.roadmapId, roadmapId))
      .orderBy(desc(roadmapReviews.createdAt));

    return reviews;
  }

  async deleteRoadmapReview(
    reviewId: number,
    userId: number,
  ): Promise<any | undefined> {
    const [deleted] = await db
      .delete(roadmapReviews)
      .where(
        and(eq(roadmapReviews.id, reviewId), eq(roadmapReviews.userId, userId)),
      )
      .returning();
    return deleted;
  }

  // Portfolio operations
  async getPortfolios(): Promise<Portfolio[]> {
    return db
      .select()
      .from(schema.portfolios)
      .where(eq(schema.portfolios.isPublic, true))
      .orderBy(desc(schema.portfolios.createdAt));
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const result = await db
      .select()
      .from(schema.portfolios)
      .where(eq(schema.portfolios.id, id))
      .limit(1);
    return result[0];
  }

  async getPortfolioByUserId(userId: number): Promise<Portfolio | undefined> {
    const result = await db
      .select()
      .from(schema.portfolios)
      .where(eq(schema.portfolios.userId, userId))
      .limit(1);
    return result[0];
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const result = await db
      .insert(schema.portfolios)
      .values(insertPortfolio)
      .returning();
    return result[0];
  }

  async updatePortfolio(
    id: number,
    updatePortfolio: Partial<InsertPortfolio>,
  ): Promise<Portfolio | undefined> {
    const result = await db
      .update(schema.portfolios)
      .set(updatePortfolio)
      .where(eq(schema.portfolios.id, id))
      .returning();
    return result[0];
  }

  async deletePortfolio(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.portfolios)
      .where(eq(schema.portfolios.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Resume Analysis operations
  async getResumeAnalyses(userId?: number): Promise<ResumeAnalysis[]> {
    if (userId) {
      return db
        .select()
        .from(schema.resumeAnalyses)
        .where(eq(schema.resumeAnalyses.userId, userId))
        .orderBy(desc(schema.resumeAnalyses.createdAt));
    }

    return db
      .select()
      .from(schema.resumeAnalyses)
      .orderBy(desc(schema.resumeAnalyses.createdAt));
  }

  async getResumeAnalysis(id: number): Promise<ResumeAnalysis | undefined> {
    const result = await db
      .select()
      .from(schema.resumeAnalyses)
      .where(eq(schema.resumeAnalyses.id, id))
      .limit(1);
    return result[0];
  }

  async createResumeAnalysis(
    insertAnalysis: InsertResumeAnalysis,
  ): Promise<ResumeAnalysis> {
    const result = await db
      .insert(schema.resumeAnalyses)
      .values(insertAnalysis)
      .returning();
    return result[0];
  }

  async deleteResumeAnalysis(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.resumeAnalyses)
      .where(eq(schema.resumeAnalyses.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Scholarship operations
  async getScholarships(educationLevel?: string): Promise<Scholarship[]> {
    if (educationLevel) {
      return db
        .select()
        .from(schema.scholarships)
        .where(eq(schema.scholarships.educationLevel, educationLevel))
        .orderBy(desc(schema.scholarships.createdAt));
    }
    return db
      .select()
      .from(schema.scholarships)
      .orderBy(desc(schema.scholarships.createdAt));
  }

  async getScholarship(id: number): Promise<Scholarship | undefined> {
    const results = await db
      .select()
      .from(schema.scholarships)
      .where(eq(schema.scholarships.id, id));
    return results[0];
  }

  async createScholarship(data: InsertScholarship): Promise<Scholarship> {
    const result = await db
      .insert(schema.scholarships)
      .values(data)
      .returning();
    return result[0];
  }

  async updateScholarship(
    id: number,
    data: Partial<InsertScholarship>,
  ): Promise<Scholarship | undefined> {
    const result = await db
      .update(schema.scholarships)
      .set(data)
      .where(eq(schema.scholarships.id, id))
      .returning();
    return result[0];
  }

  async deleteScholarship(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.scholarships)
      .where(eq(schema.scholarships.id, id))
      .returning();
    return result.length > 0;
  }

  // DSA Topics operations
  async getDsaTopics(): Promise<DsaTopic[]> {
    return db
      .select()
      .from(dsaTopics)
      .where(eq(dsaTopics.isPublished, true))
      .orderBy(desc(dsaTopics.createdAt));
  }

  async getDsaTopic(id: number): Promise<DsaTopic | undefined> {
    const results = await db
      .select()
      .from(dsaTopics)
      .where(eq(dsaTopics.id, id));
    return results[0];
  }

  async createDsaTopic(topic: InsertDsaTopic): Promise<DsaTopic> {
    const result = await db
      .insert(dsaTopics)
      .values(topic)
      .returning();
    return result[0];
  }

  async updateDsaTopic(
    id: number,
    topic: Partial<InsertDsaTopic>,
  ): Promise<DsaTopic | undefined> {
    const result = await db
      .update(dsaTopics)
      .set(topic)
      .where(eq(dsaTopics.id, id))
      .returning();
    return result[0];
  }

  async deleteDsaTopic(id: number): Promise<boolean> {
    const result = await db
      .delete(dsaTopics)
      .where(eq(dsaTopics.id, id))
      .returning();
    return result.length > 0;
  }

  // DSA Companies operations
  async getDsaCompanies(): Promise<DsaCompany[]> {
    return db
      .select()
      .from(dsaCompanies)
      .where(eq(dsaCompanies.isPublished, true))
      .orderBy(desc(dsaCompanies.problemCount));
  }

  async getDsaCompany(id: number): Promise<DsaCompany | undefined> {
    const results = await db
      .select()
      .from(dsaCompanies)
      .where(eq(dsaCompanies.id, id));
    return results[0];
  }

  async createDsaCompany(company: InsertDsaCompany): Promise<DsaCompany> {
    const result = await db
      .insert(dsaCompanies)
      .values(company)
      .returning();
    return result[0];
  }

  async updateDsaCompany(
    id: number,
    company: Partial<InsertDsaCompany>,
  ): Promise<DsaCompany | undefined> {
    const result = await db
      .update(dsaCompanies)
      .set(company)
      .where(eq(dsaCompanies.id, id))
      .returning();
    return result[0];
  }

  async deleteDsaCompany(id: number): Promise<boolean> {
    const result = await db
      .delete(dsaCompanies)
      .where(eq(dsaCompanies.id, id))
      .returning();
    return result.length > 0;
  }

  // DSA Sheets operations
  async getDsaSheets(): Promise<DsaSheet[]> {
    return db
      .select()
      .from(dsaSheets)
      .where(eq(dsaSheets.isPublished, true))
      .orderBy(desc(dsaSheets.createdAt));
  }

  async getDsaSheet(id: number): Promise<DsaSheet | undefined> {
    const results = await db
      .select()
      .from(dsaSheets)
      .where(eq(dsaSheets.id, id));
    return results[0];
  }

  async createDsaSheet(sheet: InsertDsaSheet): Promise<DsaSheet> {
    const result = await db
      .insert(dsaSheets)
      .values(sheet)
      .returning();
    return result[0];
  }

  async updateDsaSheet(
    id: number,
    sheet: Partial<InsertDsaSheet>,
  ): Promise<DsaSheet | undefined> {
    const result = await db
      .update(dsaSheets)
      .set(sheet)
      .where(eq(dsaSheets.id, id))
      .returning();
    return result[0];
  }

  async deleteDsaSheet(id: number): Promise<boolean> {
    const result = await db
      .delete(dsaSheets)
      .where(eq(dsaSheets.id, id))
      .returning();
    return result.length > 0;
  }

  // DSA Sheet Problems operations
  async getDsaSheetProblems(sheetId: number): Promise<DsaSheetProblem[]> {
    return db
      .select()
      .from(dsaSheetProblems)
      .where(eq(dsaSheetProblems.sheetId, sheetId))
      .orderBy(dsaSheetProblems.orderIndex);
  }

  async addProblemToSheet(data: InsertDsaSheetProblem): Promise<DsaSheetProblem> {
    const result = await db
      .insert(dsaSheetProblems)
      .values(data)
      .returning();
    return result[0];
  }

  async removeProblemFromSheet(id: number): Promise<boolean> {
    const result = await db
      .delete(dsaSheetProblems)
      .where(eq(dsaSheetProblems.id, id))
      .returning();
    return result.length > 0;
  }

  // Article interaction methods
  async addLikeToArticle(articleId: string, userId: string): Promise<void> {
    // Implementation for adding likes
    console.log("Adding like to article:", articleId, "by user:", userId);
  }

  async removeLikeFromArticle(
    articleId: string,
    userId: string,
  ): Promise<void> {
    // Implementation for removing likes
    console.log("Removing like from article:", articleId, "by user:", userId);
  }

  async addCommentToArticle(
    articleId: string,
    userId: string,
    comment: string,
  ): Promise<any> {
    // Implementation for adding comments
    console.log(
      "Adding comment to article:",
      articleId,
      "by user:",
      userId,
      "comment:",
      comment,
    );
    return {
      id: Date.now().toString(),
      comment,
      userId,
      createdAt: new Date(),
    };
  }

  async getCommentsForArticle(articleId: string): Promise<any[]> {
    // Implementation for getting comments
    console.log("Getting comments for article:", articleId);
    return [];
  }

  async incrementShareCountForArticle(articleId: string): Promise<void> {
    // Implementation for incrementing share count
    console.log("Incrementing share count for article:", articleId);
  }

  async incrementDownloadCountForRoadmap(roadmapId: string): Promise<void> {
    // Implementation for incrementing download count
    console.log("Incrementing download count for roadmap:", roadmapId);
  }

  async incrementShareCountForRoadmap(roadmapId: string): Promise<void> {
    // Implementation for incrementing share count
    console.log("Incrementing share count for roadmap:", roadmapId);
  }
}

export const storage = new PostgresStorage();
