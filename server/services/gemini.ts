import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ContentGenerationRequest {
  type: 'job' | 'internship' | 'article' | 'roadmap' | 'dsa-problem' | 'portfolio-website' | 'advertising-template';
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
        systemPrompt = `You are an expert ${isInternship ? 'internship' : 'job'} posting creator with access to real-time web data. Generate a comprehensive, realistic ${isInternship ? 'internship' : 'job'} posting based on current market trends in India. Include genuine company information, competitive salary ranges, and authentic requirements. Include real company logo URLs when possible. Respond with JSON in this exact format: {
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
          "companyLogo": "string (use https://logo.clearbit.com/[company-domain] format or real company logo URL)"
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
        systemPrompt = `You are an expert learning path creator with deep knowledge of current industry requirements and technologies popular in India. Generate comprehensive, practical learning roadmaps aligned with current job market demands. Include relevant visual roadmap images. Respond with JSON in this exact format: {
          "title": "string",
          "description": "string",
          "content": "string (markdown format)",
          "difficulty": "string",
          "estimatedTime": "string",
          "technologies": ["string"],
          "steps": [{"title": "string", "description": "string", "resources": ["string"]}],
          "image": "string (use learning/tech roadmap images from Unsplash like https://images.unsplash.com/photo-[id]?w=600&h=400&fit=crop)"
        }`;
        
        let roadmapPrompt = `Generate a comprehensive, industry-aligned learning roadmap for: ${request.prompt}.`;
        
        if (request.details?.fetchFromWeb) {
          roadmapPrompt += ` Base the roadmap on current industry requirements, popular technologies in Indian tech companies, and latest market trends.`;
        }
        
        if (request.details?.difficulty) {
          roadmapPrompt += ` Difficulty: ${request.details.difficulty}.`;
        }
        
        roadmapPrompt += ` Include real-world projects, relevant resources, career-focused learning path suitable for Indian job market, and appropriate roadmap visualization images.`;
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