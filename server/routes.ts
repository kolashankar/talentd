import "dotenv/config";

import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { generateContent, analyzeResume, extractTextFromFile, parseResumeForPortfolio } from "./services/gemini";
import { insertJobSchema, insertRoadmapSchema, insertArticleSchema, insertDsaProblemSchema, insertPortfolioSchema } from "@shared/schema";
import { z } from "zod";
import passport, { isAuthenticated, isAdmin, requireAuth } from "./auth";
import { upload as cloudinaryUpload, uploadToCloudinary, generateUploadSignature } from "./cloudinary";
import { eq, desc, and, or, like } from "drizzle-orm";

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
  // Authentication routes
  app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({
        authenticated: true,
        user: {
          id: req.user?.id,
          username: req.user?.username,
          email: req.user?.email,
          role: req.user?.role,
          profileImage: (req.user as any)?.profileImage
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Google OAuth routes (only if OAuth is configured)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/api/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/api/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/?error=login_failed' }),
      (req, res) => {
        // Successful authentication
        res.redirect('/?auth=success');
      }
    );
  } else {
    app.get('/api/auth/google', (req, res) => {
      res.status(500).json({ 
        error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' 
      });
    });

    app.get('/api/auth/google/callback', (req, res) => {
      res.redirect('/?error=oauth_not_configured');
    });
  }

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  // Cloudinary routes
  app.get('/api/upload/signature', isAuthenticated, (req, res) => {
    try {
      const { folder = 'portfolio-uploads', ...params } = req.query;
      const signatureData = generateUploadSignature({ folder, ...params });
      res.json(signatureData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate upload signature' });
    }
  });

  app.post('/api/upload', isAuthenticated, cloudinaryUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'portfolio-uploads',
        resource_type: 'auto'
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Jobs routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const category = req.query.category as string;
      const jobs = await storage.getJobs(category);
      // Fix: Ensure jobs is an array before calling slice
      const safeJobs = Array.isArray(jobs) ? jobs : [];
      const featuredJobs = safeJobs.slice(0, 6); // Example of using slice safely
      res.json(safeJobs); // Return all jobs, not just featured
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(parseInt(req.params.id));
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
      const job = await storage.updateJob(parseInt(req.params.id), jobData);
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
      const deleted = await storage.deleteJob(parseInt(req.params.id));
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

  // Articles Like/Comment/Share routes
  app.post("/api/articles/:id/like", requireAuth, async (req, res) => {
    try {
      const articleId = req.params.id;
      const userId = (req.user as any)?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.addLikeToArticle(articleId, userId);
      res.status(200).json({ message: "Liked successfully" });
    } catch (error) {
      console.error('Error liking article:', error);
      res.status(500).json({ message: "Failed to like article" });
    }
  });

  app.delete("/api/articles/:id/like", requireAuth, async (req, res) => {
    try {
      const articleId = req.params.id;
      const userId = (req.user as any)?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.removeLikeFromArticle(articleId, userId);
      res.status(200).json({ message: "Unliked successfully" });
    } catch (error) {
      console.error('Error unliking article:', error);
      res.status(500).json({ message: "Failed to unlike article" });
    }
  });

  app.post("/api/articles/:id/comment", requireAuth, async (req, res) => {
    try {
      const articleId = req.params.id;
      const userId = (req.user as any)?.id;
      const { comment } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!comment) {
        return res.status(400).json({ message: "Comment is required" });
      }

      const newComment = await storage.addCommentToArticle(articleId, userId, comment);
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  app.get("/api/articles/:id/comments", async (req, res) => {
    try {
      const articleId = req.params.id;
      const comments = await storage.getCommentsForArticle(articleId);
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/articles/:id/share", async (req, res) => {
    try {
      const articleId = req.params.id;
      await storage.incrementShareCountForArticle(articleId);
      res.status(200).json({ message: "Shared successfully" });
    } catch (error) {
      console.error('Error sharing article:', error);
      res.status(500).json({ message: "Failed to share article" });
    }
  });

  // Roadmaps Download/Share routes
  app.post("/api/roadmaps/:id/download", async (req, res) => {
    try {
      const roadmapId = req.params.id;
      // In a real scenario, you'd fetch roadmap data and generate a downloadable file (e.g., PDF, JSON)
      await storage.incrementDownloadCountForRoadmap(roadmapId);
      res.status(200).json({ message: "Roadmap download initiated" });
    } catch (error) {
      console.error('Error initiating roadmap download:', error);
      res.status(500).json({ message: "Failed to initiate roadmap download" });
    }
  });

  app.post("/api/roadmaps/:id/share", async (req, res) => {
    try {
      const roadmapId = req.params.id;
      await storage.incrementShareCountForRoadmap(roadmapId);
      res.status(200).json({ message: "Roadmap shared successfully" });
    } catch (error) {
      console.error('Error sharing roadmap:', error);
      res.status(500).json({ message: "Failed to share roadmap" });
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

  // Portfolio routes (Protected)
  app.get("/api/portfolios", requireAuth, async (req, res) => {
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

  app.post("/api/portfolios", requireAuth, async (req, res) => {
    try {
      const portfolioData = insertPortfolioSchema.parse({
        ...req.body,
        userId: (req.user as any)?.id
      });
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

  // Resume Analysis routes (Protected)
  app.post("/api/resume/analyze", requireAuth, upload.single('resume'), async (req, res) => {
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
        userId: (req.user as any)?.id || null,
        filename: req.file.originalname,
        fileUrl: `resume-${Date.now()}-${req.file.originalname}`,
        atsScore: analysis.atsScore,
        keywordMatches: analysis.keywordMatches,
        suggestions: analysis.suggestions,
        formatScore: analysis.formatScore,
        readabilityScore: analysis.readabilityScore,
        analysis: analysis.analysis,
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

  // Enhanced AI Portfolio Generation routes
  app.post("/api/portfolio/generate-complete", async (req, res) => {
    try {
      const { portfolioData, theme = 'modern', includeAnimations = true } = req.body;

      if (!portfolioData) {
        return res.status(400).json({ message: "Portfolio data is required" });
      }

      // Generate complete portfolio website with AI
      const prompt = `Generate a complete portfolio website for: ${JSON.stringify(portfolioData)}. Theme: ${theme}. Include animations: ${includeAnimations}`;
      const websiteCode = await generateContent(prompt);

          // Create downloadable code structure
      const codeStructure = {
        'index.html': websiteCode.html || websiteCode,
        'styles.css': websiteCode.css || 'body { font-family: Arial, sans-serif; }',
        'script.js': websiteCode.js || 'console.log("Portfolio loaded");',
        'README.md': '# AI-Generated Portfolio\n\nThis portfolio was generated using AI technology.'
      };

      res.json({
        success: true,
        websiteCode,
        codeStructure,
        downloadUrl: `/api/portfolio/download/${Date.now()}`,
        previewHtml: websiteCode.html || websiteCode
      });
    } catch (error) {
      console.error('Portfolio generation error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate complete portfolio website" 
      });
    }
  });

  app.get("/api/portfolio/download/:timestamp", async (req, res) => {
    try {
      // Generate sample portfolio structure for download
      const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>AI Generated Portfolio</h1>
    <p>This is a sample generated portfolio. Replace with actual generated content.</p>
    <script src="script.js"></script>
</body>
</html>`;

      // Set headers for HTML file download (simplified)
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="portfolio.html"');

      res.send(sampleHtml);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ message: "Failed to create download" });
    }
  });

  // AI Enhancement endpoints
  app.post("/api/ai/suggest-improvements", async (req, res) => {
    try {
      const { portfolioData, targetRole } = req.body;

      const prompt = `Suggest improvements for this portfolio targeting ${targetRole}: ${JSON.stringify(portfolioData)}`;
      const suggestions = await generateContent(prompt);

      res.json({ suggestions: JSON.parse(suggestions) });
    } catch (error) {
      console.error('AI suggestions error:', error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });

  // Enhanced Portfolio Generation (Protected)
  app.post("/api/portfolio/generate-complete", requireAuth, upload.single('resume'), async (req, res) => {
    try {
      const prompt = req.body.prompt || '';
      let portfolioData = {};
      let details = {};

      // Parse portfolio data from form if provided
      if (req.body.portfolioData) {
        try {
          portfolioData = JSON.parse(req.body.portfolioData);
        } catch (e) {
          console.log('Failed to parse portfolioData:', e);
        }
      }

      // Parse details from form if provided
      if (req.body.details) {
        try {
          details = JSON.parse(req.body.details);
        } catch (e) {
          console.log('Failed to parse details:', e);
        }
      }

      if (req.file) {
        const base64Data = req.file.buffer.toString('base64');
        const resumeText = await extractTextFromFile(base64Data, req.file.mimetype);
        const resumeData = await parseResumeForPortfolio(resumeText);
        // Merge resume data with existing portfolio data
        portfolioData = { ...resumeData, ...portfolioData };
      }

      // Ensure we have some portfolio data
      if (!portfolioData.name && !portfolioData.title) {
        return res.status(400).json({ 
          message: "Portfolio data is required. Please fill in basic information (name, title) or upload a resume." 
        });
      }

      // Generate complete portfolio website with AI and enhanced features
      const completePortfolio = await generateContent({
        type: 'portfolio-website',
        prompt: `Create a stunning, professional portfolio website with modern UI/UX design, animations, and visual assets. ${prompt}`,
        details: { 
          portfolioData,
          generateImages: true,
          generateAnimations: true,
          generateStyling: true,
          generateLogos: true,
          includeAnimations: true,
          customStyling: true,
          generateWorkflows: true,
          generateMindmap: true,
          fetchFromWeb: true,
          includeCompanyLogo: true,
          ...details
        }
      });

      // Generate sample HTML/CSS/JS for the portfolio
      const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Portfolio</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; color: white; padding: 50px 0; }
        .content { background: white; border-radius: 10px; padding: 40px; margin: 20px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
        .skill { background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .project { border: 1px solid #ddd; border-radius: 8px; padding: 20px; transition: transform 0.3s; }
        .project:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${completePortfolio.name || 'Professional Portfolio'}</h1>
            <p>${completePortfolio.title || 'Software Developer'}</p>
        </div>
        <div class="content">
            <h2>About Me</h2>
            <p>${completePortfolio.bio || 'Passionate developer with expertise in modern technologies.'}</p>
            <h2>Skills</h2>
            <div class="skills">
                ${(completePortfolio.skills || ['JavaScript', 'React', 'Node.js', 'Python']).map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
            <h2>Projects</h2>
            <div class="projects">
                <div class="project">
                    <h3>AI Portfolio Generator</h3>
                    <p>A cutting-edge portfolio generator using artificial intelligence to create personalized websites.</p>
                </div>
                <div class="project">
                    <h3>Modern Web App</h3>
                    <p>Full-stack application with React frontend and Node.js backend, featuring real-time updates.</p>
                </div>
            </div>
        </div>
    </div>
    <script>
        console.log('AI Generated Portfolio Loaded');
        // Add smooth scrolling and animations
        document.querySelectorAll('.project').forEach(project => {
            project.addEventListener('mouseenter', () => {
                project.style.background = '#f8f9fa';
            });
            project.addEventListener('mouseleave', () => {
                project.style.background = 'white';
            });
        });
    </script>
</body>
</html>`;

      // Structure the response with portfolio data and code
      const response = {
        portfolioData: completePortfolio,
        portfolioCode: {
          html: sampleHTML,
          css: '/* CSS included in HTML */',
          js: '/* JavaScript included in HTML */'
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Portfolio generation error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate portfolio" });
    }
  });

  // Portfolio Download Route
  app.post("/api/portfolio/download", async (req, res) => {
    try {
      const { portfolioCode } = req.body;

      if (!portfolioCode) {
        return res.status(400).json({ message: "Portfolio code is required" });
      }

      // Create a simple ZIP-like response with the portfolio files
      const portfolioFiles = {
        'index.html': portfolioCode.html || '<html><body><h1>Generated Portfolio</h1></body></html>',
        'styles.css': portfolioCode.css || 'body { font-family: Arial, sans-serif; }',
        'script.js': portfolioCode.js || 'console.log("Portfolio loaded");',
        'README.md': '# AI-Generated Portfolio\n\nThis portfolio was generated using AI technology.\n\n## Files\n- index.html: Main HTML file\n- styles.css: CSS styles\n- script.js: JavaScript functionality\n\n## Usage\nOpen index.html in your web browser to view the portfolio.'
      };

      // For simplicity, we'll send the HTML content as a downloadable file
      // In a real implementation, you'd create a proper ZIP file
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="portfolio.html"');
      res.send(portfolioFiles['index.html']);
    } catch (error) {
      console.error('Portfolio download error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to prepare download" });
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
  app.post("/api/admin/generate-template", isAuthenticated, async (req, res) => {
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
          colorGrading: true,
          fetchFromWeb: true
        }
      });

      res.json(template);
    } catch (error) {
      console.error('Template generation error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to generate template" });
    }
  });

  app.post("/api/admin/download-template", isAuthenticated, async (req, res) => {
    try {
      const { template } = req.body;

      if (!template) {
        return res.status(400).json({ message: "Template data is required" });
      }

      // Create template files content
      const templateFiles = {
        'template.html': template.htmlCode || '<html><body><h1>Generated Template</h1></body></html>',
        'styles.css': template.cssCode || 'body { font-family: Arial, sans-serif; }',
        'script.js': template.jsCode || 'console.log("Template loaded");',
        'README.md': `# ${template.templateName || 'Generated Template'}\n\nThis template was generated using AI.\n\n## Files\n- template.html: Main template file\n- styles.css: CSS styles\n- script.js: JavaScript functionality`,
        'brand-guidelines.txt': template.brandGuidelines || 'Brand guidelines for the template'
      };

      // For simplicity, send the main HTML file
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="template.html"');
      res.send(templateFiles['template.html']);
    } catch (error) {
      console.error('Template download error:', error);
      res.status(500).json({ message: "Failed to create template download" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}