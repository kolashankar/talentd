
import { Router } from 'express';
import { generateFlowchartFromRoadmap } from '../services/gemini.js';
import { isAuthenticated, isAdmin } from '../auth.js';

const router = Router();

router.post('/api/roadmaps/generate-flowchart', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, technologies, difficulty } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const flowchartData = await generateFlowchartFromRoadmap({
      title,
      description,
      technologies: technologies || [],
      difficulty: difficulty || 'intermediate',
    });

    res.json(flowchartData);
  } catch (error) {
    console.error('Flowchart generation error:', error);
    res.status(500).json({
      message: 'Failed to generate flowchart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
