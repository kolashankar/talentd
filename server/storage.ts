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
    
    // Initialize with sample data to prevent empty state
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create admin user
    const adminId = "admin-1";
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      createdAt: new Date(),
    });

    // Sample jobs
    const sampleJob = {
      id: "job-1",
      title: "Software Engineer Intern",
      company: "Tech Corp",
      location: "San Francisco, CA",
      salaryRange: "$60,000 - $80,000",
      jobType: "internship",
      experienceLevel: "fresher",
      description: "Exciting opportunity for a software engineering intern to work on cutting-edge projects.",
      requirements: "Computer Science degree, JavaScript, React knowledge",
      skills: ["JavaScript", "React", "Node.js"],
      companyLogo: "https://via.placeholder.com/200x200/4F46E5/white?text=TC",
      applicationUrl: "https://techcorp.com/careers",
      isActive: true,
      category: "internship",
      createdAt: new Date(),
    };
    this.jobs.set(sampleJob.id, sampleJob);

    // Sample roadmap
    const sampleRoadmap = {
      id: "roadmap-1",
      title: "Frontend Developer Roadmap",
      description: "Complete guide to becoming a frontend developer",
      content: "Learn HTML, CSS, JavaScript, React, and modern development practices.",
      difficulty: "beginner",
      estimatedTime: "3-6 months",
      technologies: ["HTML", "CSS", "JavaScript", "React"],
      steps: [
        { title: "Learn HTML", description: "Master HTML basics", resources: [] },
        { title: "Learn CSS", description: "Style your websites", resources: [] },
      ],
      isPublished: true,
      createdAt: new Date(),
    };
    this.roadmaps.set(sampleRoadmap.id, sampleRoadmap);

    // Sample article
    const sampleArticle = {
      id: "article-1",
      title: "Getting Started with React",
      content: "React is a popular JavaScript library for building user interfaces...",
      excerpt: "Learn the basics of React development",
      author: "Tech Writer",
      category: "Technology",
      tags: ["React", "JavaScript", "Frontend"],
      isPublished: true,
      readTime: 5,
      createdAt: new Date(),
    };
    this.articles.set(sampleArticle.id, sampleArticle);

    // Sample DSA problem
    const sampleDsaProblem = {
      id: "dsa-1",
      title: "Two Sum",
      description: "Given an array of integers, return indices of two numbers that add up to a target.",
      difficulty: "easy",
      category: "Array",
      solution: "Use a hash map to store complements and find the solution in O(n) time.",
      hints: ["Think about using a hash map", "Store complements as you iterate"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      tags: ["Array", "Hash Map"],
      companies: ["Google", "Facebook"],
      isPublished: true,
      createdAt: new Date(),
    };
    this.dsaProblems.set(sampleDsaProblem.id, sampleDsaProblem);
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
      skills: Array.isArray(insertJob.skills) ? insertJob.skills : [],
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
      skills: Array.isArray(updateJob.skills) ? updateJob.skills : Array.isArray(job.skills) ? job.skills : []
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
      technologies: Array.isArray(insertRoadmap.technologies) ? insertRoadmap.technologies : [],
      steps: Array.isArray(insertRoadmap.steps) ? insertRoadmap.steps : [],
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
      technologies: Array.isArray(updateRoadmap.technologies) ? updateRoadmap.technologies : Array.isArray(roadmap.technologies) ? roadmap.technologies : [],
      steps: Array.isArray(updateRoadmap.steps) ? updateRoadmap.steps : Array.isArray(roadmap.steps) ? roadmap.steps : []
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
      tags: Array.isArray(insertArticle.tags) ? insertArticle.tags : [],
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
      hints: Array.isArray(insertProblem.hints) ? insertProblem.hints : [],
      tags: Array.isArray(insertProblem.tags) ? insertProblem.tags : [],
      companies: Array.isArray(insertProblem.companies) ? insertProblem.companies : [],
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
      hints: Array.isArray(updateProblem.hints) ? updateProblem.hints : Array.isArray(problem.hints) ? problem.hints : [],
      tags: Array.isArray(updateProblem.tags) ? updateProblem.tags : Array.isArray(problem.tags) ? problem.tags : [],
      companies: Array.isArray(updateProblem.companies) ? updateProblem.companies : Array.isArray(problem.companies) ? problem.companies : []
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
      skills: Array.isArray(insertPortfolio.skills) ? insertPortfolio.skills : [],
      projects: Array.isArray(insertPortfolio.projects) ? insertPortfolio.projects : [],
      experience: Array.isArray(insertPortfolio.experience) ? insertPortfolio.experience : [],
      education: Array.isArray(insertPortfolio.education) ? insertPortfolio.education : [],
      isPublic: insertPortfolio.isPublic ?? true,
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
      skills: Array.isArray(updatePortfolio.skills) ? updatePortfolio.skills : Array.isArray(portfolio.skills) ? portfolio.skills : [],
      projects: Array.isArray(updatePortfolio.projects) ? updatePortfolio.projects : Array.isArray(portfolio.projects) ? portfolio.projects : [],
      experience: Array.isArray(updatePortfolio.experience) ? updatePortfolio.experience : Array.isArray(portfolio.experience) ? portfolio.experience : [],
      education: Array.isArray(updatePortfolio.education) ? updatePortfolio.education : Array.isArray(portfolio.education) ? portfolio.education : []
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
