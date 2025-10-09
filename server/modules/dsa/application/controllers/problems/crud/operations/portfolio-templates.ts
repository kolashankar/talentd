
import { Router } from "express";
import { isAuthenticated } from "../auth.js";

const router = Router();

router.post("/api/portfolio/generate-template", isAuthenticated, async (req, res) => {
  try {
    const { templateId, portfolioData } = req.body;

    if (!templateId || !portfolioData) {
      return res.status(400).json({ 
        message: "Template ID and portfolio data are required" 
      });
    }

    // Generate template based on templateId
    const templateGenerators = {
      "modern-glass": generateGlassMorphismTemplate,
      "cyber-neon": generateCyberNeonTemplate,
      "floating-elements": generateFloatingElementsTemplate,
      // Add more template generators here
    };

    const generator = templateGenerators[templateId as keyof typeof templateGenerators];
    
    if (!generator) {
      return res.status(400).json({ 
        message: `Template ${templateId} not found` 
      });
    }

    const templateCode = generator(portfolioData);

    res.json({
      success: true,
      templateId,
      code: templateCode,
      shareUrl: `${process.env.BASE_URL}/portfolio/view/${req.user.id}?template=${templateId}`
    });

  } catch (error) {
    console.error("Template generation error:", error);
    res.status(500).json({ 
      message: "Failed to generate template",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

router.post("/api/portfolio/share-template", isAuthenticated, async (req, res) => {
  try {
    const { templateCode, portfolioData } = req.body;

    // Generate a unique share ID
    const shareId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // In a real app, you'd save this to a database
    // For now, we'll create a temporary URL
    const shareUrl = `${process.env.BASE_URL}/portfolio/shared/${shareId}`;

    res.json({
      success: true,
      shareUrl,
      shareId,
      expiresIn: "30 days"
    });

  } catch (error) {
    console.error("Template sharing error:", error);
    res.status(500).json({ 
      message: "Failed to create share link",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Template generator functions
function generateGlassMorphismTemplate(data: any) {
  // Glass morphism template implementation
  return {
    html: `<!-- Glass Morphism Template -->`,
    css: `/* Glass effects and animations */`,
    js: `// Interactive effects`
  };
}

function generateCyberNeonTemplate(data: any) {
  // Cyber neon template implementation
  return {
    html: `<!-- Cyber Neon Template -->`,
    css: `/* Neon effects and cyber styling */`,
    js: `// Matrix effects and animations`
  };
}

function generateFloatingElementsTemplate(data: any) {
  // Floating elements template implementation
  return {
    html: `<!-- Floating Elements Template -->`,
    css: `/* 3D floating animations */`,
    js: `// Physics-based interactions`
  };
}

export default router;
