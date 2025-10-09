
import { Router } from 'express';
import { isAuthenticated } from '../auth.js';
import { generateImprovedResume } from '../services/gemini.js';

const router = Router();

router.post('/api/resume/generate-improved', isAuthenticated, async (req, res) => {
  try {
    const { originalText, suggestions, keywordMatches } = req.body;

    if (!originalText) {
      return res.status(400).json({ message: 'Original resume text is required' });
    }

    const improvedResume = await generateImprovedResume({
      originalText,
      suggestions: suggestions || [],
      keywordMatches: keywordMatches || [],
    });

    res.json({
      success: true,
      improvedResume,
    });
  } catch (error) {
    console.error('Resume improvement error:', error);
    res.status(500).json({
      message: 'Failed to generate improved resume',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

