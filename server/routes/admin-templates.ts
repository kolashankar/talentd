import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { db } from '../database.js';
import { templates } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticated, isAdmin } from '../auth.js';
import { extractTemplate, installTemplate, deleteTemplate } from '../template-upload.js';
import { loadRegistry, removeTemplateFromRegistry, getActiveTemplates } from '../template-registry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'templates');
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'template-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

// Upload new template
router.post(
  '/api/admin/templates/upload',
  isAuthenticated,
  isAdmin,
  upload.single('template'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const zipPath = req.file.path;

      // Extract and validate template
      let manifest;
      try {
        manifest = await extractTemplate(zipPath);
      } catch (error) {
        await fs.unlink(zipPath).catch(() => {});
        throw new Error(`Invalid template structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Install template to public directory
      const templateDir = await installTemplate(zipPath, manifest);

      // Save template metadata to database
      const [dbTemplate] = await db.insert(templates).values({
        templateId: manifest.id,
        name: manifest.name,
        description: manifest.description,
        version: manifest.version,
        category: manifest.category,
        thumbnailUrl: manifest.thumbnail,
        manifestPath: `/templates/${manifest.id}/manifest.json`,
        entryFile: manifest.entryFile,
        features: manifest.features || [],
        isPremium: manifest.isPremium || false,
        isActive: true,
        uploadedBy: req.user ? (req.user as any).id : null,
      }).returning();

      // Clean up uploaded zip file
      await fs.unlink(zipPath);

      res.json({
        success: true,
        message: 'Template uploaded successfully',
        template: {
          id: dbTemplate.templateId,
          name: dbTemplate.name,
          version: dbTemplate.version,
          category: dbTemplate.category,
        },
      });
    } catch (error) {
      console.error('Template upload error:', error);

      // Clean up uploaded file on error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch {}
      }

      res.status(500).json({
        message: 'Failed to upload template',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Get all templates (admin view with inactive ones)
router.get('/api/admin/templates', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const allTemplates = await db.select().from(templates);
    const registry = await loadRegistry();

    res.json({
      database: allTemplates,
      registry: registry.templates,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch templates',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete template
router.delete(
  '/api/admin/templates/:templateId',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { templateId } = req.params;

      // Remove from database
      await db.delete(templates).where(eq(templates.templateId, templateId));

      // Remove from registry
      await removeTemplateFromRegistry(templateId);

      // Delete template files
      await deleteTemplate(templateId);

      res.json({
        success: true,
        message: 'Template deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete template',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Toggle template active status
router.patch(
  '/api/admin/templates/:templateId/toggle',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { templateId } = req.params;

      const [template] = await db
        .select()
        .from(templates)
        .where(eq(templates.templateId, templateId));

      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      const [updated] = await db
        .update(templates)
        .set({ isActive: !template.isActive, updatedAt: new Date() })
        .where(eq(templates.templateId, templateId))
        .returning();

      res.json({
        success: true,
        template: updated,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to toggle template status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Get public templates (user view - only active ones)
router.get('/api/templates', async (req, res) => {
  try {
    const activeTemplates = await getActiveTemplates();

    res.json({
      templates: activeTemplates,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch templates',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;