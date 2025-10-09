import { Router } from 'express';
import { isAuthenticated } from '../auth.js';
import { parseResumeForPortfolio } from '../services/gemini.js';
import { createPortfolioZip } from '../template-upload.js';
import { getTemplateById } from '../template-registry.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import type { PortfolioTemplateData } from '@shared/template-types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Parse resume and generate portfolio data
router.post('/api/portfolio/parse-resume', isAuthenticated, async (req, res) => {
  try {
    const { resumeText, resumeUrl } = req.body;

    if (!resumeText && !resumeUrl) {
      return res.status(400).json({ 
        message: 'Resume text or URL is required' 
      });
    }

    // Parse resume using Gemini AI
    const parsedData = await parseResumeForPortfolio(resumeText);

    // Transform to PortfolioTemplateData format
    const portfolioData: PortfolioTemplateData = {
      personal: {
        name: parsedData.name || 'Your Name',
        title: parsedData.title || 'Professional',
        bio: parsedData.summary || '',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        location: parsedData.location || '',
        website: parsedData.website || '',
        profileImage: '',
      },
      skills: parsedData.skills || [],
      projects: (parsedData.projects || []).map((project: any) => ({
        title: project.title || project.name || '',
        description: project.description || '',
        technologies: project.technologies || project.tools || [],
        githubUrl: project.githubUrl || project.url || '',
        liveUrl: project.liveUrl || project.demo || '',
        imageUrl: project.imageUrl || '',
      })),
      experience: (parsedData.experience || []).map((exp: any) => ({
        title: exp.title || exp.position || '',
        company: exp.company || '',
        duration: exp.duration || exp.period || '',
        description: exp.description || exp.responsibilities?.join('. ') || '',
      })),
      education: (parsedData.education || []).map((edu: any) => ({
        degree: edu.degree || '',
        institution: edu.institution || edu.school || '',
        year: edu.year || edu.period || '',
      })),
      social: {
        github: parsedData.github || '',
        linkedin: parsedData.linkedin || '',
        twitter: parsedData.twitter || '',
      },
    };

    res.json({
      success: true,
      data: portfolioData,
    });
  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({
      message: 'Failed to parse resume',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Generate portfolio code with selected template
router.post('/api/portfolio/generate-code', isAuthenticated, async (req, res) => {
  try {
    const { portfolioData, templateId } = req.body;

    if (!portfolioData || !templateId) {
      return res.status(400).json({
        message: 'Portfolio data and template ID are required',
      });
    }

    // Validate template exists
    const template = await getTemplateById(templateId);
    if (!template) {
      return res.status(404).json({
        message: 'Template not found',
      });
    }

    // Generate portfolio code structure
    const outputDir = path.join(__dirname, '..', '..', 'uploads', 'portfolios');
    await fs.mkdir(outputDir, { recursive: true });

    const zipFileName = `portfolio-${Date.now()}.zip`;
    const zipPath = path.join(outputDir, zipFileName);

    // Create portfolio zip
    await createPortfolioZip(portfolioData, templateId, zipPath);

    // Generate download URL
    const downloadUrl = `/api/portfolio/download/${zipFileName}`;

    res.json({
      success: true,
      downloadUrl,
      fileName: zipFileName,
      template: {
        id: template.id,
        name: template.name,
      },
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({
      message: 'Failed to generate portfolio code',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Download generated portfolio
router.get('/api/portfolio/download/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'portfolios', fileName);

    // Check if file exists
    await fs.access(filePath);

    res.download(filePath, fileName, async (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      
      // Clean up file after download
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    });
  } catch (error) {
    res.status(404).json({
      message: 'File not found',
    });
  }
});

// Get code view/structure for a portfolio
router.post('/api/portfolio/code-view', isAuthenticated, async (req, res) => {
  try {
    const { portfolioData, templateId } = req.body;

    if (!portfolioData || !templateId) {
      return res.status(400).json({
        message: 'Portfolio data and template ID are required',
      });
    }

    // Generate code structure without creating zip
    const codeStructure = {
      'package.json': JSON.stringify({
        name: `${portfolioData.personal.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          'framer-motion': '^11.13.1',
          '@emailjs/browser': '^4.4.1',
        },
      }, null, 2),
      'src/data/portfolio-data.ts': `export const portfolioData = ${JSON.stringify(portfolioData, null, 2)};`,
      'src/App.tsx': `import Portfolio from './components/Portfolio';\n\nfunction App() {\n  return <Portfolio />;\n}\n\nexport default App;`,
    };

    res.json({
      success: true,
      structure: codeStructure,
      folders: [
        'src/',
        'src/components/',
        'src/data/',
        'src/assets/',
        'src/lib/',
        'public/',
      ],
    });
  } catch (error) {
    console.error('Code view error:', error);
    res.status(500).json({
      message: 'Failed to generate code view',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
