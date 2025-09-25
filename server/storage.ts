import { type User, type InsertUser, type Job, type InsertJob, type Roadmap, type InsertRoadmap, type Article, type InsertArticle, type DsaProblem, type InsertDsaProblem, type Portfolio, type InsertPortfolio, type ResumeAnalysis, type InsertResumeAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Job operations
  getJobs(category?: string): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;

  // Roadmap operations
  getRoadmaps(): Promise<Roadmap[]>;
  getRoadmap(id: string): Promise<Roadmap | undefined>;
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  updateRoadmap(id: string, roadmap: Partial<InsertRoadmap>): Promise<Roadmap | undefined>;
  deleteRoadmap(id: string): Promise<boolean>;

  // Article operations
  getArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;

  // DSA Problem operations
  getDsaProblems(): Promise<DsaProblem[]>;
  getDsaProblem(id: string): Promise<DsaProblem | undefined>;
  createDsaProblem(problem: InsertDsaProblem): Promise<DsaProblem>;
  updateDsaProblem(id: string, problem: Partial<InsertDsaProblem>): Promise<DsaProblem | undefined>;
  deleteDsaProblem(id: string): Promise<boolean>;

  // Portfolio operations
  getPortfolios(): Promise<Portfolio[]>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  getPortfolioByUserId(userId: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: string): Promise<boolean>;

  // Resume Analysis operations
  getResumeAnalyses(userId?: string): Promise<ResumeAnalysis[]>;
  getResumeAnalysis(id: string): Promise<ResumeAnalysis | undefined>;
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;
  deleteResumeAnalysis(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, Job>;
  private roadmaps: Map<string, Roadmap>;
  private articles: Map<string, Article>;
  private dsaProblems: Map<string, DsaProblem>;
  private portfolios: Map<string, Portfolio>;
  private resumeAnalyses: Map<string, ResumeAnalysis>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.roadmaps = new Map();
    this.articles = new Map();
    this.dsaProblems = new Map();
    this.portfolios = new Map();
    this.resumeAnalyses = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Job operations
  async getJobs(category?: string): Promise<Job[]> {
    const jobs = Array.from(this.jobs.values()).filter(job => job.isActive);
    if (category) {
      return jobs.filter(job => job.category === category);
    }
    return jobs.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = { 
      ...insertJob, 
      id, 
      category: insertJob.category || "job",
      skills: insertJob.skills || [],
      isActive: insertJob.isActive ?? true,
      createdAt: new Date() 
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updateJob: Partial<InsertJob>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { 
      ...job, 
      ...updateJob,
      skills: updateJob.skills || job.skills || []
    };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  // Roadmap operations
  async getRoadmaps(): Promise<Roadmap[]> {
    return Array.from(this.roadmaps.values())
      .filter(roadmap => roadmap.isPublished)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    return this.roadmaps.get(id);
  }

  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const id = randomUUID();
    const roadmap: Roadmap = { 
      ...insertRoadmap, 
      id, 
      technologies: insertRoadmap.technologies || [],
      steps: insertRoadmap.steps || [],
      isPublished: insertRoadmap.isPublished ?? true,
      createdAt: new Date() 
    };
    this.roadmaps.set(id, roadmap);
    return roadmap;
  }

  async updateRoadmap(id: string, updateRoadmap: Partial<InsertRoadmap>): Promise<Roadmap | undefined> {
    const roadmap = this.roadmaps.get(id);
    if (!roadmap) return undefined;
    
    const updatedRoadmap = { 
      ...roadmap, 
      ...updateRoadmap,
      technologies: updateRoadmap.technologies || roadmap.technologies || [],
      steps: updateRoadmap.steps || roadmap.steps || []
    };
    this.roadmaps.set(id, updatedRoadmap);
    return updatedRoadmap;
  }

  async deleteRoadmap(id: string): Promise<boolean> {
    return this.roadmaps.delete(id);
  }

  // Article operations
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isPublished)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = { 
      ...insertArticle, 
      id, 
      tags: insertArticle.tags || [],
      isPublished: insertArticle.isPublished ?? true,
      createdAt: new Date() 
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updateArticle: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { 
      ...article, 
      ...updateArticle,
      tags: updateArticle.tags || article.tags || []
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  // DSA Problem operations
  async getDsaProblems(): Promise<DsaProblem[]> {
    return Array.from(this.dsaProblems.values())
      .filter(problem => problem.isPublished)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getDsaProblem(id: string): Promise<DsaProblem | undefined> {
    return this.dsaProblems.get(id);
  }

  async createDsaProblem(insertProblem: InsertDsaProblem): Promise<DsaProblem> {
    const id = randomUUID();
    const problem: DsaProblem = { 
      ...insertProblem, 
      id, 
      hints: insertProblem.hints || [],
      tags: insertProblem.tags || [],
      companies: insertProblem.companies || [],
      isPublished: insertProblem.isPublished ?? true,
      createdAt: new Date() 
    };
    this.dsaProblems.set(id, problem);
    return problem;
  }

  async updateDsaProblem(id: string, updateProblem: Partial<InsertDsaProblem>): Promise<DsaProblem | undefined> {
    const problem = this.dsaProblems.get(id);
    if (!problem) return undefined;
    
    const updatedProblem = { 
      ...problem, 
      ...updateProblem,
      hints: updateProblem.hints || problem.hints || [],
      tags: updateProblem.tags || problem.tags || [],
      companies: updateProblem.companies || problem.companies || []
    };
    this.dsaProblems.set(id, updatedProblem);
    return updatedProblem;
  }

  async deleteDsaProblem(id: string): Promise<boolean> {
    return this.dsaProblems.delete(id);
  }

  // Portfolio operations
  async getPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values())
      .filter(portfolio => portfolio.isPublic)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getPortfolioByUserId(userId: string): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(portfolio => portfolio.userId === userId);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = { 
      ...insertPortfolio, 
      id, 
      skills: insertPortfolio.skills || [],
      projects: insertPortfolio.projects || [],
      experience: insertPortfolio.experience || [],
      education: insertPortfolio.education || [],
      isPublic: insertPortfolio.isPublic ?? false,
      createdAt: new Date() 
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: string, updatePortfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    const updatedPortfolio = { 
      ...portfolio, 
      ...updatePortfolio,
      skills: updatePortfolio.skills || portfolio.skills || [],
      projects: updatePortfolio.projects || portfolio.projects || [],
      experience: updatePortfolio.experience || portfolio.experience || [],
      education: updatePortfolio.education || portfolio.education || []
    };
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // Resume Analysis operations
  async getResumeAnalyses(userId?: string): Promise<ResumeAnalysis[]> {
    const analyses = Array.from(this.resumeAnalyses.values());
    if (userId) {
      return analyses.filter(analysis => analysis.userId === userId);
    }
    return analyses.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getResumeAnalysis(id: string): Promise<ResumeAnalysis | undefined> {
    return this.resumeAnalyses.get(id);
  }

  async createResumeAnalysis(insertAnalysis: InsertResumeAnalysis): Promise<ResumeAnalysis> {
    const id = randomUUID();
    const analysis: ResumeAnalysis = { 
      ...insertAnalysis, 
      id, 
      createdAt: new Date() 
    };
    this.resumeAnalyses.set(id, analysis);
    return analysis;
  }

  async deleteResumeAnalysis(id: string): Promise<boolean> {
    return this.resumeAnalyses.delete(id);
  }
}

export const storage = new MemStorage();
