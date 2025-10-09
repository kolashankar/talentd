import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ContentGenerationRequest {
  type: 'job' | 'internship' | 'article' | 'roadmap' | 'dsa-problem' | 'dsa-topic' | 'dsa-company' | 'dsa-sheet' | 'portfolio-website' | 'advertising-template' | 'scholarship';
  prompt: string;
  details?: {
    company?: string;
    role?: string;
    requirements?: string;
    category?: string;
    difficulty?: string;
    location?: string;
    fetchFromWeb?: boolean;
    includeCompanyLogo?: boolean;
    generateImages?: boolean;
    generateMindmap?: boolean;
    generateWorkflows?: boolean;
    includeAnimations?: boolean;
    customStyling?: boolean;
    portfolioData?: any;
    generateAnimations?: boolean;
    generateStyling?: boolean;
    contentData?: any;
    templateType?: string;
    colorGrading?: boolean;
    generateLogos?: boolean;
  };
}

export interface ResumeAnalysisRequest {
  resumeText: string;
  jobDescription?: string;
}

export async function generateContent(request: ContentGenerationRequest): Promise<any> {
  try {
    let systemPrompt = "";
    let userPrompt = "";

    switch (request.type) {
      case 'job':
      case 'internship':
        const isInternship = request.type === 'internship';
        systemPrompt = `You are an expert ${isInternship ? 'internship' : 'job'} posting creator with access to real-time web data. Generate a comprehensive, realistic ${isInternship ? 'internship' : 'job'} posting based on current market trends in India. Include genuine company information, competitive salary ranges, and authentic requirements. Generate visual assets when requested. Respond with JSON in this exact format: {
          "title": "string",
          "company": "string",
          "location": "string",
          "salaryRange": "string",
          "jobType": "string",
          "experienceLevel": "string",
          "description": "string",
          "requirements": "string",
          "responsibilities": "string",
          "benefits": "string",
          "skills": ["string"],
          "companyWebsite": "string",
          "applicationUrl": "string",
          "companyLogo": "string (use https://logo.clearbit.com/[company-domain] format or real company logo URL)",
          "generatedImages": ["string (relevant job/company images)"],
          "workflowImages": ["string (workflow diagram URLs)"],
          "mindmapImages": ["string (skills mindmap URLs)"],
          "isAIGenerated": true
        }`;

        let enhancedPrompt = `Generate a realistic ${isInternship ? 'internship' : 'job'} posting for: ${request.prompt}.`;

        if (request.details?.location) {
          enhancedPrompt += ` Location focus: ${request.details.location}.`;
        } else {
          enhancedPrompt += ` Focus on opportunities in India (major cities like Bangalore, Mumbai, Delhi, Hyderabad, Pune).`;
        }

        if (request.details?.company) {
          enhancedPrompt += ` Company: ${request.details.company}.`;
        }

        if (request.details?.fetchFromWeb) {
          enhancedPrompt += ` Create realistic content based on current market trends and actual company practices in India.`;
        }

        if (request.details?.includeCompanyLogo) {
          enhancedPrompt += ` Include a realistic company logo URL using https://logo.clearbit.com/[company-domain] format for real companies.`;
        }

        if (request.details?.generateImages) {
          enhancedPrompt += ` Generate relevant images for the job posting, company culture, and work environment.`;
        }

        if (request.details?.generateWorkflows) {
          enhancedPrompt += ` Create workflow diagrams showing the application process and typical day-to-day work activities.`;
        }

        if (request.details?.generateMindmap) {
          enhancedPrompt += ` Generate skill mindmaps showing required technical and soft skills with visual connections.`;
        }

        if (request.details?.includeAnimations) {
          enhancedPrompt += ` Include suggestions for interactive animations and transitions for the job posting display.`;
        }

        enhancedPrompt += ` Ensure all details are authentic and competitive for the Indian job market.`;
        userPrompt = enhancedPrompt;
        break;

      case 'article':
        systemPrompt = `You are an expert technical writer with access to current tech trends and real-world insights. Generate comprehensive, up-to-date articles with authentic content based on current industry practices. Focus on Indian tech ecosystem when relevant. Include relevant high-quality image URLs. Respond with JSON in this exact format: {
          "title": "string",
          "content": "string (markdown format, comprehensive with code examples if relevant)",
          "excerpt": "string",
          "author": "string (realistic tech writer name)",
          "category": "string",
          "tags": ["string"],
          "readTime": number,
          "featuredImage": "string (use Unsplash URLs like https://images.unsplash.com/photo-[id]?w=800&h=400&fit=crop or relevant tech images)"
        }`;

        let articlePrompt = `Generate a comprehensive, current technical article about: ${request.prompt}.`;

        if (request.details?.fetchFromWeb) {
          articlePrompt += ` Base the content on current industry trends, latest best practices, and real-world examples from the Indian and global tech industry.`;
        }

        if (request.details?.category) {
          articlePrompt += ` Category: ${request.details.category}.`;
        }

        articlePrompt += ` Include practical examples, code snippets where relevant, actionable insights, and appropriate featured images from Unsplash that match the article topic.`;
        userPrompt = articlePrompt;
        break;

      case 'roadmap':
        systemPrompt = `You are an expert learning path creator with deep knowledge of current industry requirements and technologies popular in India. Generate comprehensive, practical learning roadmaps aligned with current job market demands. Include relevant visual roadmap images and flowchart structure. Respond with JSON in this exact format: {
          "title": "string",
          "description": "string (detailed description)",
          "content": "string (markdown format with comprehensive content)",
          "difficulty": "string (beginner, intermediate, or advanced)",
          "estimatedTime": "string",
          "educationLevel": "string (upto-10th, 12th, btech, degree, postgrad, or professional)",
          "technologies": ["string"],
          "steps": [{"title": "string", "description": "string", "resources": ["string"]}],
          "image": "string (use learning/tech roadmap images from Unsplash like https://images.unsplash.com/photo-[id]?w=600&h=400&fit=crop)",
          "flowchartData": {
            "nodes": [{"id": "string", "type": "string", "position": {"x": number, "y": number}, "data": {"label": "string", "description": "string", "redirectUrl": "string", "color": "string"}}],
            "edges": [{"id": "string", "source": "string", "target": "string", "type": "smoothstep", "animated": true}]
          }
        }`;

        let roadmapPrompt = `You are an expert learning path designer. Create a detailed, metric-based workflow for learning: "${request.prompt}".

CRITICAL REQUIREMENTS:
1. Create EXACTLY 20-30 interconnected nodes for a comprehensive learning journey
2. Each node MUST include:
   - A specific, actionable title (e.g., "Master JavaScript Fundamentals - Week 1-2")
   - Detailed description with learning objectives, key concepts, and metrics (hours, difficulty level)
   - A valid redirect URL to quality learning resources (YouTube playlists, official docs, Udemy, freeCodeCamp)
   - Appropriate color: #4CAF50 (beginner), #FF9800 (intermediate), #F44336 (advanced), #9C27B0 (projects)
3. Design a progressive flow: Basics → Fundamentals → Intermediate → Advanced → Projects → Mastery
4. Include milestone/checkpoint nodes every 5-7 nodes to track progress
5. Add practical project nodes with real-world applications

Return ONLY valid JSON (no markdown, no explanation):
{
  "nodes": [
    {
      "id": "node-1",
      "type": "default",
      "position": { "x": 100, "y": 50 },
      "data": {
        "label": "Start: Prerequisites (Week 0)",
        "description": "Essential prerequisites: Basic programming, command line, Git. Duration: 5-10 hours. Resources: freeCodeCamp basics",
        "redirectUrl": "https://www.youtube.com/results?search_query=${encodeURIComponent(request.prompt)}+prerequisites",
        "color": "#4CAF50"
      }
    },
    {
      "id": "node-2",
      "type": "default",
      "position": { "x": 100, "y": 150 },
      "data": {
        "label": "Fundamentals Part 1 (Week 1-2)",
        "description": "Core concepts and syntax. Duration: 20 hours. Difficulty: Beginner. Practice: 50+ exercises",
        "redirectUrl": "https://www.youtube.com/results?search_query=${encodeURIComponent(request.prompt)}+fundamentals+tutorial",
        "color": "#4CAF50"
      }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "node-1",
      "target": "node-2",
      "type": "smoothstep",
      "animated": true
    }
  ]
}

IMPORTANT: Generate at least 25 nodes covering the complete learning path from beginner to expert level with measurable metrics.`;
        userPrompt = roadmapPrompt;
        break;

      case 'dsa-problem':
        systemPrompt = `You are an expert DSA problem creator with knowledge of interview patterns at top Indian and global tech companies. Generate comprehensive DSA problems similar to those asked in real interviews. Focus on companies with significant presence in India. Respond with JSON in this exact format: {
          "title": "string",
          "description": "string",
          "difficulty": "string",
          "category": "string",
          "solution": "string (with detailed code examples and explanations)",
          "hints": ["string"],
          "timeComplexity": "string",
          "spaceComplexity": "string",
          "tags": ["string"],
          "companies": ["string (include Indian and global companies)"]
        }`;

        let dsaPrompt = `Generate a realistic DSA problem for: ${request.prompt}.`;

        if (request.details?.fetchFromWeb) {
          dsaPrompt += ` Base the problem on actual interview questions asked at top tech companies in India like TCS, Infosys, Wipro, Flipkart, Zomato, as well as global companies with Indian offices.`;
        }

        if (request.details?.difficulty) {
          dsaPrompt += ` Difficulty: ${request.details.difficulty}.`;
        }

        if (request.details?.category) {
          dsaPrompt += ` Category: ${request.details.category}.`;
        }

        dsaPrompt += ` Include multiple solution approaches, edge cases, and detailed explanations.`;
        userPrompt = dsaPrompt;
        break;

      case 'dsa-topic':
        systemPrompt = `You are an expert DSA educator. Create a comprehensive DSA topic with:
- Topic name and description
- Difficulty level (beginner/intermediate/advanced)
- Key concepts covered
- Estimated problem count
- Learning resources
- Common problem patterns

Return as JSON with: name, description, difficulty (beginner/intermediate/advanced), problemCount (number), concepts (array), resources (array)`;
        userPrompt = `Generate a comprehensive DSA topic about: ${request.prompt}.`;
        break;

      case 'dsa-company':
        systemPrompt = `You are an expert on company interview patterns. Create a company profile for DSA preparation with:
- Company name
- Interview difficulty level
- Common problem categories
- Problem count
- Tips for preparation
- Recent interview patterns

Return as JSON with: name, description, logo (placeholder URL), problemCount (number), difficulty, categories (array), tips (array)`;
        userPrompt = `Generate a DSA preparation profile for the company: ${request.prompt}.`;
        if (request.details?.difficulty) {
          userPrompt += ` Focus on ${request.details.difficulty} level interviews.`;
        }
        if (request.details?.category) {
          userPrompt += ` Common categories include: ${request.details.category}.`;
        }
        break;

      case 'dsa-sheet':
        systemPrompt = `You are an expert DSA sheet curator. Create a comprehensive problem sheet with:
- Sheet name and description
- Target difficulty level
- Creator name
- Problem selection strategy
- Estimated problem count
- Learning path

Return as JSON with: name, description, creator, type (official/public/community), problemCount (number), difficulty, topics (array), learningPath (string)`;
        userPrompt = `Generate a DSA problem sheet named: "${request.prompt}".`;
        if (request.details?.difficulty) {
          userPrompt += ` Target difficulty: ${request.details.difficulty}.`;
        }
        if (request.details?.category) {
          userPrompt += ` Topics covered: ${request.details.category}.`;
        }
        break;

      case 'portfolio-website':
        systemPrompt = `You are an expert web developer and designer specializing in creating stunning, professional portfolio websites. Generate complete, modern portfolio websites with HTML, CSS, and JavaScript. Include responsive design, animations, and professional styling. When enhanced features are requested, integrate real data, generate relevant images, create visual assets, and implement advanced functionality. Respond with JSON in this exact format: {
          "portfolioData": {
            "name": "string",
            "title": "string",
            "bio": "string",
            "skills": ["string"],
            "projects": [{"title": "string", "description": "string", "technologies": ["string"], "demoUrl": "string", "githubUrl": "string"}],
            "experience": [{"title": "string", "company": "string", "duration": "string", "description": "string"}],
            "education": [{"degree": "string", "institution": "string", "year": "string"}]
          },
          "portfolioCode": {
            "html": "string (complete responsive HTML with modern structure)",
            "css": "string (complete CSS with animations, gradients, modern styling)",
            "js": "string (complete JavaScript with animations, interactions)"
          },
          "generatedAssets": {
            "profileImage": "string (professional headshot URL from Unsplash)",
            "projectImages": ["string (project screenshot URLs)"],
            "companyLogos": ["string (company logo URLs)"],
            "skillIcons": ["string (skill icon URLs)"],
            "backgroundImages": ["string (hero/section background URLs)"]
          },
          "animations": {
            "heroAnimations": "string (CSS animations for hero section)",
            "scrollAnimations": "string (scroll-triggered animations)",
            "hoverEffects": "string (interactive hover effects)",
            "transitionEffects": "string (smooth page transitions)"
          },
          "enhancedFeatures": {
            "contactForm": "string (functional contact form HTML/JS)",
            "skillsVisualization": "string (animated skills charts)",
            "projectGallery": "string (interactive project showcase)",
            "resumeDownload": "string (downloadable resume feature)"
          }
        }`;

        let portfolioPrompt = `Generate a complete, professional portfolio website: ${request.prompt}.`;

        if (request.details?.portfolioData) {
          portfolioPrompt += ` Use this portfolio data: ${JSON.stringify(request.details.portfolioData)}.`;
        }

        if (request.details?.fetchFromWeb) {
          portfolioPrompt += ` Fetch real data from web sources, use current design trends, and incorporate industry best practices for portfolio websites.`;
        }

        if (request.details?.generateImages) {
          portfolioPrompt += ` Generate high-quality, professional images from Unsplash for profile photos, project screenshots, company logos, and background visuals. Use URLs like https://images.unsplash.com/photo-[id]?w=800&h=600&fit=crop for relevant images.`;
        }

        if (request.details?.generateAnimations) {
          portfolioPrompt += ` Include modern CSS animations, scroll-triggered effects, hover interactions, and smooth transitions throughout the website.`;
        }

        if (request.details?.generateLogos) {
          portfolioPrompt += ` Generate or include company logos using https://logo.clearbit.com/[domain] format and skill icons from reliable CDNs.`;
        }

        if (request.details?.customStyling) {
          portfolioPrompt += ` Apply custom styling with modern gradients, shadows, typography, and responsive design that works on all devices.`;
        }

        if (request.details?.generateWorkflows) {
          portfolioPrompt += ` Include workflow diagrams and visual representations of development processes and project timelines.`;
        }

        if (request.details?.generateMindmap) {
          portfolioPrompt += ` Create visual skill mindmaps and technology relationship diagrams.`;
        }

        portfolioPrompt += ` Make the website fully responsive, accessible, and optimized for performance. Include modern features like dark mode toggle, smooth scrolling, and professional animations.`;
        userPrompt = portfolioPrompt;
        break;

      case 'advertising-template':
        systemPrompt = `You are an expert marketing designer and copywriter. Generate comprehensive advertising templates with HTML/CSS code, marketing copy, and design specifications. Include color schemes, typography, and branding elements. Respond with JSON in this exact format: {
          "templateName": "string",
          "templateType": "string",
          "htmlCode": "string (complete HTML template)",
          "cssCode": "string (complete CSS styling)",
          "copyText": "string (marketing copy)",
          "colorScheme": {
            "primary": "string",
            "secondary": "string",
            "accent": "string",
            "background": "string"
          },
          "typography": {
            "headingFont": "string",
            "bodyFont": "string"
          },
          "assets": {
            "logoUrl": "string",
            "backgroundImage": "string",
            "iconSet": ["string"]
          },
          "brandGuidelines": "string",
          "downloadFiles": ["string"]
        }`;

        let templatePrompt = `Generate a professional advertising template: ${request.prompt}.`;

        if (request.details?.templateType) {
          templatePrompt += ` Template type: ${request.details.templateType}.`;
        }

        if (request.details?.contentData) {
          templatePrompt += ` Content to promote: ${JSON.stringify(request.details.contentData)}.`;
        }

        if (request.details?.generateLogos) {
          templatePrompt += ` Include professional logo concepts and branding elements.`;
        }

        if (request.details?.colorGrading) {
          templatePrompt += ` Apply professional color grading and visual hierarchy.`;
        }

        templatePrompt += ` Make it modern, professional, and conversion-focused.`;
        userPrompt = templatePrompt;
        break;

      case 'scholarship':
        systemPrompt = `You are an expert educational consultant with knowledge of scholarship programs in India and globally. Generate comprehensive, realistic scholarship information based on current opportunities. Respond with JSON in this exact format: {
          "title": "string",
          "description": "string (detailed description, minimum 100 characters)",
          "provider": "string",
          "amount": "string",
          "educationLevel": "string (upto-10th, 12th, btech, degree, or postgrad)",
          "eligibility": "string (detailed eligibility criteria, minimum 100 characters)",
          "deadline": "string (ISO date format YYYY-MM-DD)",
          "applicationUrl": "string",
          "category": "string (merit, need, minority, sports, or government)",
          "tags": ["string"],
          "benefits": "string (detailed benefits)",
          "requirements": "string (detailed requirements)",
          "howToApply": "string (step by step application process)",
          "isActive": true,
          "featured": boolean
        }`;

        let scholarshipPrompt = `Generate a comprehensive scholarship program: ${request.prompt}.`;

        if (request.details?.fetchFromWeb) {
          scholarshipPrompt += ` Base this on real scholarship programs available in India from organizations like UGC, AICTE, state governments, and private foundations. Ensure all details are authentic and current for 2024-2025.`;
        }

        if (request.details?.educationLevel) {
          scholarshipPrompt += ` Focus on scholarships for ${request.details.educationLevel} students.`;
        }

        if (request.details?.category) {
          scholarshipPrompt += ` Category: ${request.details.category}.`;
        }

        scholarshipPrompt += ` Include realistic amounts in INR (e.g., ₹5,000 to ₹2,00,000), genuine application processes, appropriate deadlines (within next 3-6 months), and clear eligibility criteria. Make it helpful for Indian students with proper government/institutional URLs where applicable.`;
        userPrompt = scholarshipPrompt;
        break;

      default:
        throw new Error('Invalid content type');
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: userPrompt,
    });

    const content = response.text;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Content generation error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeResume(request: ResumeAnalysisRequest): Promise<{
  atsScore: number;
  keywordMatches: {
    matched: string[];
    missing: string[];
    total: number;
  };
  suggestions: string[];
  formatScore: string;
  readabilityScore: string;
  analysis: string;
  industryInsights: {
    detectedIndustry: string;
    industrySpecificTips: string[];
    salaryInsights: string;
  };
  skillsAnalysis: {
    technicalSkills: string[];
    softSkills: string[];
    missingSkills: string[];
  };
  experienceAnalysis: {
    totalYears: number;
    careerProgression: string;
    gapAnalysis: string[];
  };
  improvementPriority: {
    critical: string[];
    important: string[];
    nice_to_have: string[];
  };
}> {
  try {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer with deep knowledge of recruitment processes across industries. Analyze the resume comprehensively and provide actionable insights. Respond with JSON in this exact format: {
      "atsScore": number (0-100),
      "keywordMatches": {
        "matched": ["string"],
        "missing": ["string"],
        "total": number
      },
      "suggestions": ["string"],
      "formatScore": "string (Excellent/Very Good/Good/Fair/Poor)",
      "readabilityScore": "string (Excellent/Very Good/Good/Fair/Poor)",
      "analysis": "string (detailed analysis)",
      "industryInsights": {
        "detectedIndustry": "string",
        "industrySpecificTips": ["string"],
        "salaryInsights": "string"
      },
      "skillsAnalysis": {
        "technicalSkills": ["string"],
        "softSkills": ["string"],
        "missingSkills": ["string"]
      },
      "experienceAnalysis": {
        "totalYears": number,
        "careerProgression": "string",
        "gapAnalysis": ["string"]
      },
      "improvementPriority": {
        "critical": ["string"],
        "important": ["string"],
        "nice_to_have": ["string"]
      }
    }`;

    const userPrompt = `Analyze this resume comprehensively for ATS compatibility and career optimization:

Resume Content:
${request.resumeText}

${request.jobDescription ? `Target Job Description:
${request.jobDescription}` : ''}

Provide a thorough analysis including:
1. ATS compatibility score and keyword optimization
2. Industry detection and specific insights
3. Skills analysis (technical, soft, missing)
4. Experience progression and gap analysis
5. Prioritized improvement recommendations
6. Salary insights based on skills and experience
7. Format and readability assessment`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            atsScore: { type: "number" },
            keywordMatches: {
              type: "object",
              properties: {
                matched: { type: "array", items: { type: "string" } },
                missing: { type: "array", items: { type: "string" } },
                total: { type: "number" }
              },
              required: ["matched", "missing", "total"]
            },
            suggestions: { type: "array", items: { type: "string" } },
            formatScore: { type: "string" },
            readabilityScore: { type: "string" },
            analysis: { type: "string" },
            industryInsights: {
              type: "object",
              properties: {
                detectedIndustry: { type: "string" },
                industrySpecificTips: { type: "array", items: { type: "string" } },
                salaryInsights: { type: "string" }
              },
              required: ["detectedIndustry", "industrySpecificTips", "salaryInsights"]
            },
            skillsAnalysis: {
              type: "object",
              properties: {
                technicalSkills: { type: "array", items: { type: "string" } },
                softSkills: { type: "array", items: { type: "string" } },
                missingSkills: { type: "array", items: { type: "string" } }
              },
              required: ["technicalSkills", "softSkills", "missingSkills"]
            },
            experienceAnalysis: {
              type: "object",
              properties: {
                totalYears: { type: "number" },
                careerProgression: { type: "string" },
                gapAnalysis: { type: "array", items: { type: "string" } }
              },
              required: ["totalYears", "careerProgression", "gapAnalysis"]
            },
            improvementPriority: {
              type: "object",
              properties: {
                critical: { type: "array", items: { type: "string" } },
                important: { type: "array", items: { type: "string" } },
                nice_to_have: { type: "array", items: { type: "string" } }
              },
              required: ["critical", "important", "nice_to_have"]
            }
          },
          required: ["atsScore", "keywordMatches", "suggestions", "formatScore", "readabilityScore", "analysis", "industryInsights", "skillsAnalysis", "experienceAnalysis", "improvementPriority"]
        }
      },
      contents: userPrompt,
    });

    const analysis = JSON.parse(response.text || '{}');

    // Ensure score is within valid range
    analysis.atsScore = Math.max(0, Math.min(100, analysis.atsScore));

    return analysis;
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractTextFromFile(base64Data: string, mimeType: string): Promise<string> {
  try {
    if (mimeType.includes('image') || mimeType.includes('pdf')) {
      const imageBytes = Buffer.from(base64Data, 'base64');

      const contents = [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        "Extract all text content from this resume/document. Return only the extracted text without any formatting or additional commentary.",
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
      });

      return response.text || '';
    } else {
      // For text-based files, decode base64
      return Buffer.from(base64Data, 'base64').toString('utf-8');
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function parseResumeForPortfolio(resumeText: string): Promise<any> {
  try {
    const systemPrompt = `You are an expert resume parser that extracts structured data for portfolio creation. Parse the resume and extract relevant information for a professional portfolio. Respond with JSON in this exact format: {
      "name": "string",
      "title": "string (professional title/role)",
      "bio": "string (professional summary/bio)",
      "email": "string",
      "phone": "string",
      "website": "string",
      "linkedin": "string",
      "github": "string",
      "skills": ["string"],
      "projects": [{
        "title": "string",
        "description": "string",
        "technologies": ["string"],
        "demoUrl": "string",
        "githubUrl": "string"
      }],
      "experience": [{
        "title": "string",
        "company": "string",
        "duration": "string",
        "description": "string"
      }],
      "education": [{
        "degree": "string",
        "institution": "string",
        "year": "string",
        "grade": "string"
      }]
    }`;

    const userPrompt = `Parse this resume for portfolio data extraction:

Resume Content:
${resumeText}

Extract:
1. Personal information (name, contact details, social links)
2. Professional title and bio/summary
3. Skills (technical and soft skills)
4. Work experience with descriptions
5. Education details
6. Projects (if mentioned)
7. Clean up and format all data appropriately`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: userPrompt,
    });

    const portfolioData = JSON.parse(response.text || '{}');
    return portfolioData;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateImprovedResume(data: {
  originalText: string;
  suggestions: string[];
  keywordMatches: string[];
}): Promise<string> {
  try {
    const systemPrompt = `You are an expert resume writer and career coach. Generate an improved version of the resume that:
1. Incorporates all suggested improvements
2. Adds missing keywords naturally
3. Uses strong action verbs and quantifiable achievements
4. Follows ATS-friendly formatting
5. Maintains professional language and tone
6. Organizes content logically and clearly

Format the resume in a clean, professional text format that can be easily copied.`;

    const userPrompt = `Original Resume:
${data.originalText}

Suggestions for Improvement:
${data.suggestions.join('\n')}

Missing Keywords to Include:
${data.keywordMatches.join(', ')}

Please generate an improved version of this resume incorporating all suggestions and keywords naturally.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return response.text || data.originalText;
  } catch (error) {
    console.error('Resume improvement error:', error);
    throw new Error('Failed to generate improved resume');
  }
}

export async function generateFlowchartFromRoadmap(roadmapData: {
  title: string;
  description: string;
  technologies: string[];
  difficulty: string;
}): Promise<any> {
  try {
    const systemPrompt = `You are an expert at creating interactive n8n-style learning workflows with multiple branches and paths. Generate a comprehensive workflow structure with:

1. Multiple learning paths and branches (parallel tracks for different learning styles)
2. Decision points where learners can choose different specialization paths
3. Nodes with rich, detailed content
4. Real external resource URLs

Respond with JSON in this exact format:
{
  "nodes": [{
    "id": "string (unique like 'node-1')",
    "type": "string (input for start, output for end, default for others)",
    "position": {"x": number, "y": number},
    "data": {
      "label": "string (node title, max 6 words)",
      "description": "string (2-3 sentence summary visible on node)",
      "content": "string (detailed 4-6 paragraph explanation with examples)",
      "resources": ["string (5-10 real URLs to documentation, tutorials, courses)"],
      "redirectUrl": "string (main resource URL like https://reactjs.org/docs)",
      "color": "string (use different colors for different branches: #3b82f6, #10b981, #f59e0b, #ef4444, #8b5cf6)"
    }
  }],
  "edges": [{
    "id": "string (unique like 'edge-1-2')",
    "source": "string (source node id)",
    "target": "string (target node id)",
    "type": "smoothstep",
    "animated": true,
    "style": {"stroke": "string (color matching nodes)", "strokeWidth": 2}
  }]
}

IMPORTANT LAYOUT RULES:
- Start node at x: 100, y: 400
- Space nodes horizontally 300-400px apart
- Create multiple vertical branches (y: 200, 400, 600) for parallel paths
- End nodes at x: 1800+
- Make it look like a real n8n workflow with branches converging and diverging
- Include at least 15-20 nodes with multiple decision points`;

    const userPrompt = `Generate an interactive n8n-style learning workflow for this roadmap:

Title: ${roadmapData.title}
Description: ${roadmapData.description}
Technologies: ${roadmapData.technologies.join(', ')}
Difficulty: ${roadmapData.difficulty}

Create a comprehensive n8n-style workflow with MULTIPLE BRANCHES and paths:
1. Start node (id: 'node-start', type: 'input', position: {x: 400, y: 0}) - Entry point
2. Create 12-15 learning nodes with BRANCHING PATHS:
   - Main learning path (sequential nodes)
   - Alternative/advanced branches for different learning styles
   - Parallel practice/project branches
   - Optional deep-dive branches
3. Each node MUST have:
   - Unique id: 'node-1', 'node-2', etc.
   - Type: 'default', 'input', or 'output'
   - Exact position: {x: number (0-1200), y: number (0-1500)}
   - data.label: Short title (max 5 words)
   - data.description: 1-2 sentence summary
   - data.content: 4-6 paragraphs of detailed learning content
   - data.resources: Array of 4-6 resource links/names
   - data.redirectUrl: Valid external learning URL (documentation, tutorials, courses)
   - data.color: Hex color (#3b82f6 for basics, #8b5cf6 for frameworks, #10b981 for practice, #f59e0b for advanced, #ef4444 for milestones)
4. End node (id: 'node-end', type: 'output', position: {x: 400, y: 1400}) - Completion
5. Create edges with MULTIPLE BRANCHES:
   - Main sequential flow (node-start -> node-1 -> node-2 -> ... -> node-end)
   - Branch connections (node-3 -> node-7 for advanced path)
   - Parallel paths (node-4 -> node-8 AND node-4 -> node-9)
   - Edge format: {id: 'edge-1', source: 'node-1', target: 'node-2', type: 'smoothstep', animated: true}
6. Position nodes to create visual branches:
   - Main path: x: 400, y: incremental
   - Left branch: x: 100-200, y: aligned
   - Right branch: x: 700-800, y: aligned
7. Include real external URLs for redirectUrl (like https://reactjs.org/docs, https://developer.mozilla.org, https://www.udemy.com/course/...)
8. Make it look like a real n8n workflow with connected nodes and multiple execution paths`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: userPrompt,
    });

    const flowchartData = JSON.parse(response.text || '{}');
    return flowchartData;
  } catch (error) {
    console.error('Flowchart generation error:', error);
    throw new Error(`Failed to generate flowchart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}