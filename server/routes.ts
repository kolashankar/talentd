import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { generateContent, analyzeResume, extractTextFromFile, parseResumeForPortfolio } from "./services/gemini";
import { insertJobSchema, insertRoadmapSchema, insertArticleSchema, insertDsaProblemSchema, insertPortfolioSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, JPEG, and PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Jobs routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const category = req.query.category as string;
      const jobs = await storage.getJobs(category);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const jobData = insertJobSchema.partial().parse(req.body);
      const job = await storage.updateJob(req.params.id, jobData);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteJob(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // Roadmaps routes
  app.get("/api/roadmaps", async (req, res) => {
    try {
      const roadmaps = await storage.getRoadmaps();
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roadmaps" });
    }
  });

  app.get("/api/roadmaps/:id", async (req, res) => {
    try {
      const roadmap = await storage.getRoadmap(req.params.id);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch roadmap" });
    }
  });

  app.post("/api/roadmaps", async (req, res) => {
    try {
      const roadmapData = insertRoadmapSchema.parse(req.body);
      const roadmap = await storage.createRoadmap(roadmapData);
      res.status(201).json(roadmap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid roadmap data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create roadmap" });
    }
  });

  app.put("/api/roadmaps/:id", async (req, res) => {
    try {
      const roadmapData = insertRoadmapSchema.partial().parse(req.body);
      const roadmap = await storage.updateRoadmap(req.params.id, roadmapData);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      res.json(roadmap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid roadmap data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update roadmap" });
    }
  });

  app.delete("/api/roadmaps/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRoadmap(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete roadmap" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const articleData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(req.params.id, articleData);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteArticle(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // DSA Problems routes
  app.get("/api/dsa-problems", async (req, res) => {
    try {
      const problems = await storage.getDsaProblems();
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DSA problems" });
    }
  });

  app.get("/api/dsa-problems/:id", async (req, res) => {
    try {
      const problem = await storage.getDsaProblem(req.params.id);
      if (!problem) {
        return res.status(404).json({ message: "DSA problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DSA problem" });
    }
  });

  app.post("/api/dsa-problems", async (req, res) => {
    try {
      const problemData = insertDsaProblemSchema.parse(req.body);
      const problem = await storage.createDsaProblem(problemData);
      res.status(201).json(problem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid DSA problem data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create DSA problem" });
    }
  });

  app.put("/api/dsa-problems/:id", async (req, res) => {
    try {
      const problemData = insertDsaProblemSchema.partial().parse(req.body);
      const problem = await storage.updateDsaProblem(req.params.id, problemData);
      if (!problem) {
        return res.status(404).json({ message: "DSA problem not found" });
      }
      res.json(problem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid DSA problem data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update DSA problem" });
    }
  });

  app.delete("/api/dsa-problems/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDsaProblem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "DSA problem not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete DSA problem" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolios", async (req, res) => {
    try {
      const portfolios = await storage.getPortfolios();
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  app.get("/api/portfolios/:id", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio(req.params.id);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.get("/api/portfolios/user/:userId", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolioByUserId(req.params.userId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    try {
      const portfolioData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(portfolioData);
      res.status(201).json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });

  app.put("/api/portfolios/:id", async (req, res) => {
    try {
      const portfolioData = insertPortfolioSchema.partial().parse(req.body);
      const portfolio = await storage.updatePortfolio(req.params.id, portfolioData);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid portfolio data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update portfolio" });
    }
  });

  app.delete("/api/portfolios/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePortfolio(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete portfolio" });
    }
  });

  // AI Content Generation route
  app.post("/api/ai/generate-content", async (req, res) => {
    try {
      const { type, prompt, details } = req.body;
      
      if (!type || !prompt) {
        return res.status(400).json({ message: "Type and prompt are required" });
      }

      const content = await generateContent({ type, prompt, details });
      res.json(content);
    } catch (error) {
      console.error('Content generation error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate content" });
    }
  });

  // Portfolio Resume Parsing route
  app.post("/api/portfolio/parse-resume", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Resume file is required" });
      }

      const base64Data = req.file.buffer.toString('base64');
      
      // Extract text from the uploaded file
      const resumeText = await extractTextFromFile(base64Data, req.file.mimetype);
      
      if (!resumeText || resumeText.trim().length === 0) {
        return res.status(400).json({ message: "Could not extract text from the uploaded file" });
      }

      // Parse resume for portfolio data
      const portfolioData = await parseResumeForPortfolio(resumeText);
      
      res.json(portfolioData);
    } catch (error) {
      console.error('Resume parsing error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to parse resume" });
    }
  });

  // Resume Analysis routes
  app.post("/api/resume/analyze", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Resume file is required" });
      }

      const jobDescription = req.body.jobDescription || '';
      const base64Data = req.file.buffer.toString('base64');
      
      // Extract text from the uploaded file
      const resumeText = await extractTextFromFile(base64Data, req.file.mimetype);
      
      if (!resumeText || resumeText.trim().length === 0) {
        return res.status(400).json({ message: "Could not extract text from the uploaded file" });
      }

      // Analyze the resume
      const analysis = await analyzeResume({ resumeText, jobDescription });
      
      // Store the analysis
      const resumeAnalysis = await storage.createResumeAnalysis({
        userId: req.body.userId || null,
        filename: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        atsScore: analysis.atsScore,
        keywordMatches: analysis.keywordMatches,
        suggestions: analysis.suggestions,
        formatScore: analysis.formatScore,
        readabilityScore: analysis.readabilityScore,
        analysis: analysis.analysis,
        industryInsights: analysis.industryInsights,
        skillsAnalysis: analysis.skillsAnalysis,
        experienceAnalysis: analysis.experienceAnalysis,
        improvementPriority: analysis.improvementPriority,
      });

      res.json(resumeAnalysis);
    } catch (error) {
      console.error('Resume analysis error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to analyze resume" });
    }
  });

  app.get("/api/resume/analyses", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const analyses = await storage.getResumeAnalyses(userId);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume analyses" });
    }
  });

  app.get("/api/resume/analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getResumeAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Resume analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume analysis" });
    }
  });

  app.delete("/api/resume/analyses/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteResumeAnalysis(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Resume analysis not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resume analysis" });
    }
  });

  // Enhanced Portfolio Generation
  app.post("/api/portfolio/generate-complete", upload.single('resume'), async (req, res) => {
    try {
      const prompt = req.body.prompt || '';
      let portfolioData = {};
      
      if (req.file) {
        const base64Data = req.file.buffer.toString('base64');
        const resumeText = await extractTextFromFile(base64Data, req.file.mimetype);
        portfolioData = await parseResumeForPortfolio(resumeText);
      }

      // Generate complete portfolio website with AI
      const completePortfolio = await generateContent({
        type: 'portfolio-website',
        prompt: `Create a complete portfolio website with HTML, CSS, JavaScript, animations, and modern design. ${prompt}`,
        details: { 
          portfolioData,
          generateImages: true,
          generateAnimations: true,
          generateStyling: true 
        }
      });

      res.json(completePortfolio);
    } catch (error) {
      console.error('Portfolio generation error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate portfolio" });
    }
  });

  // Portfolio Download
  app.post("/api/portfolio/download", async (req, res) => {
    try {
      const { portfolioCode } = req.body;
      // Create ZIP file with 5-level folder structure
      // Implementation would create a proper folder structure
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="portfolio-website.zip"');
      // Send ZIP file
      res.send(Buffer.from('Portfolio ZIP content'));
    } catch (error) {
      res.status(500).json({ message: "Failed to create download" });
    }
  });

  // Google Auth routes
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { credential } = req.body;
      // Verify Google JWT token and create user session
      // Implementation would verify the token and create session
      res.json({ success: true, user: { name: "User", email: "user@example.com" } });
    } catch (error) {
      res.status(401).json({ message: "Authentication failed" });
    }
  });

  app.get("/api/auth/status", async (req, res) => {
    try {
      // Check session status
      res.json({ authenticated: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to check auth status" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // Clear session
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  // Admin Template Generation
  app.post("/api/admin/generate-template", async (req, res) => {
    try {
      const { content, type, templateType, prompt } = req.body;
      
      if (!content || !content.title) {
        return res.status(400).json({ message: "Content with title is required" });
      }
      
      const template = await generateContent({
        type: 'advertising-template',
        prompt: `Create a ${templateType || 'social-media'} template for ${type}: ${content.title}. ${prompt || ''}`,
        details: {
          contentData: content,
          templateType: templateType || 'social-media',
          generateImages: true,
          generateLogos: true,
          colorGrading: true
        }
      });

      res.json(template);
    } catch (error) {
      console.error('Template generation error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate template" });
    }
  });

  app.post("/api/admin/download-template", async (req, res) => {
    try {
      const { template } = req.body;
      // Create template files ZIP
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="template.zip"');
      res.send(Buffer.from('Template ZIP content'));
    } catch (error) {
      res.status(500).json({ message: "Failed to create template download" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
