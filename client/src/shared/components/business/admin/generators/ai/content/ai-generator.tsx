import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, Sparkles, Loader2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiGeneratorProps {
  className?: string;
  onContentGenerated?: (content: any) => void;
}

export function AiGenerator({ className, onContentGenerated }: AiGeneratorProps) {
  const [contentType, setContentType] = useState("job");
  const [prompt, setPrompt] = useState("");
  const [details, setDetails] = useState({
    company: "",
    role: "",
    requirements: "",
    category: "",
    difficulty: "",
    location: "",
    fetchFromWeb: false,
    includeCompanyLogo: false,
    generateImages: false,
    generateWorkflows: false,
    generateMindmaps: false,
    includeAnimations: false,
    customStyling: false,
  });
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: { type: string; prompt: string; details: any }) => {
      const enhancedData = {
        ...data,
        details: {
          ...data.details,
          // Ensure all enhanced features are passed
          fetchFromWeb: details.fetchFromWeb,
          includeCompanyLogo: details.includeCompanyLogo,
          generateImages: details.generateImages,
          generateWorkflows: details.generateWorkflows,
          generateMindmaps: details.generateMindmaps,
          includeAnimations: details.includeAnimations,
          customStyling: details.customStyling
        }
      };

      const response = await apiRequest('POST', '/api/ai/generate-content', enhancedData);
      const result = await response.json();
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: "Content Generated",
        description: "AI has successfully generated your content",
      });

      // Enrich content with required fields and ensure all data is properly structured
      let enrichedContent: any = {
        ...result,
        isActive: true,
        isPublished: true,
      };

      // Content type specific enrichment
      if (contentType === 'job' || contentType === 'internship') {
        enrichedContent = {
          ...enrichedContent,
          category: contentType === 'job' ? 'job' : 'internship',
          jobType: contentType === 'internship' ? 'internship' : result.jobType || 'job',
          experienceLevel: contentType === 'internship' ? 'fresher' : result.experienceLevel || 'experienced',
          skills: result.skills || [],
          companyLogo: result.companyLogo || '',
          workflowImages: result.workflowImages || [],
          mindmapImages: result.mindmapImages || [],
          generatedImages: result.generatedImages || [],
        };
      } else if (contentType === 'article') {
        enrichedContent = {
          ...enrichedContent,
          tags: result.tags || [],
          readTime: result.readTime || 5,
          featuredImage: result.featuredImage || '',
        };
      } else if (contentType === 'roadmap') {
        enrichedContent = {
          ...enrichedContent,
          technologies: result.technologies || [],
          steps: result.steps || [],
          flowchartData: result.flowchartData || null,
          image: result.image || '',
          educationLevel: result.educationLevel || 'btech',
        };
      } else if (contentType === 'dsa-problem') {
        enrichedContent = {
          ...enrichedContent,
          hints: result.hints || [],
          tags: result.tags || [],
          companies: result.companies || [],
        };
      } else if (contentType === 'dsa-topic') {
        enrichedContent = {
          ...enrichedContent,
          name: result.name || result.title || '',
          difficulty: result.difficulty || 'beginner',
          problemCount: result.problemCount || 0,
          topicIds: result.topicIds || [],
          companyIds: result.companyIds || [],
        };
      } else if (contentType === 'dsa-company') {
        enrichedContent = {
          ...enrichedContent,
          name: result.name || result.title || '',
          logo: result.logo || '',
          problemCount: result.problemCount || 0,
          topicIds: result.topicIds || [],
          companyIds: result.companyIds || [],
        };
      } else if (contentType === 'dsa-sheet') {
        enrichedContent = {
          ...enrichedContent,
          name: result.name || result.title || '',
          creator: result.creator || 'AI Generated',
          type: result.type || 'public',
          problemCount: result.problemCount || 0,
          followerCount: 0,
        };
      } else if (contentType === 'scholarship') {
        enrichedContent = {
          ...enrichedContent,
          tags: result.tags || [],
          isActive: result.isActive ?? true,
          featured: result.featured ?? false,
        };
      }

      onContentGenerated?.(enrichedContent);
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please provide a prompt for content generation",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      type: contentType,
      prompt,
      details,
    });
  };

  const getPromptPlaceholder = () => {
    switch (contentType) {
      case "job":
        return "e.g., Software Engineer at Google for React developers in India";
      case "internship":
        return "e.g., Frontend Developer Internship at Flipkart for students";
      case "article":
        return "e.g., Best practices for React hooks in 2024";
      case "roadmap":
        return "e.g., Complete Frontend Developer learning path";
      case "dsa-problem":
        return "e.g., Array problem about finding duplicates";
      case "dsa-topic":
        return "e.g., Binary Trees topic with problem recommendations";
      case "dsa-company":
        return "e.g., Google interview preparation company profile";
      case "dsa-sheet":
        return "e.g., Complete DSA preparation sheet for beginners";
      case "scholarship":
        return "e.g., Merit scholarship for engineering students";
      default:
        return "Describe what you want to generate...";
    }
  };

  const renderTypeSpecificFields = () => {
    switch (contentType) {
      case "job":
      case "internship":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                value={details.company}
                onChange={(e) => setDetails({ ...details, company: e.target.value })}
                placeholder="e.g., Google, Flipkart"
                data-testid="input-company"
              />
            </div>
            <div>
              <Label htmlFor="role">Role (Optional)</Label>
              <Input
                value={details.role}
                onChange={(e) => setDetails({ ...details, role: e.target.value })}
                placeholder="e.g., Frontend Developer"
                data-testid="input-role"
              />
            </div>
          </div>
        );
      case "article":
        return (
          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              value={details.category}
              onChange={(e) => setDetails({ ...details, category: e.target.value })}
              placeholder="e.g., Technology, Career"
              data-testid="input-category"
            />
          </div>
        );
      case "roadmap":
        return (
          <div>
            <Label htmlFor="difficulty">Difficulty (Optional)</Label>
            <Select onValueChange={(value) => setDetails({ ...details, difficulty: value })}>
              <SelectTrigger data-testid="select-difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "dsa-problem":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty (Optional)</Label>
              <Select onValueChange={(value) => setDetails({ ...details, difficulty: value })}>
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                value={details.category}
                onChange={(e) => setDetails({ ...details, category: e.target.value })}
                placeholder="e.g., Array, String, Tree"
                data-testid="input-category"
              />
            </div>
          </div>
        );
      case "dsa-topic":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty Level (Optional)</Label>
              <Select onValueChange={(value) => setDetails({ ...details, difficulty: value })}>
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="problemCount">Problem Count (Optional)</Label>
              <Input
                type="number"
                value={details.problemCount || ''}
                onChange={(e) => setDetails({ ...details, problemCount: e.target.value })}
                placeholder="e.g., 25"
                data-testid="input-problem-count"
              />
            </div>
          </div>
        );
      case "dsa-company":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company Name (Optional)</Label>
              <Input
                value={details.company}
                onChange={(e) => setDetails({ ...details, company: e.target.value })}
                placeholder="e.g., Google, Amazon"
                data-testid="input-company"
              />
            </div>
            <div>
              <Label htmlFor="problemCount">Problem Count (Optional)</Label>
              <Input
                type="number"
                value={details.problemCount || ''}
                onChange={(e) => setDetails({ ...details, problemCount: e.target.value })}
                placeholder="e.g., 150"
                data-testid="input-problem-count"
              />
            </div>
          </div>
        );
      case "dsa-sheet":
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creator">Creator Name (Optional)</Label>
              <Input
                value={details.creator || ''}
                onChange={(e) => setDetails({ ...details, creator: e.target.value })}
                placeholder="e.g., Striver, Love Babbar"
                data-testid="input-creator"
              />
            </div>
            <div>
              <Label htmlFor="type">Sheet Type (Optional)</Label>
              <Select onValueChange={(value) => setDetails({ ...details, type: value })}>
                <SelectTrigger data-testid="select-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="official">Official</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn("bg-gradient-to-r from-accent/10 to-secondary/10 border border-border", className)} data-testid="ai-generator">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2" data-testid="ai-generator-title">
          <div className="w-10 h-10 bg-accent/20 text-accent rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <span>AI Content Generator</span>
            <p className="text-sm font-normal text-muted-foreground">
              Generate content automatically with AI
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Content Type Selection */}
        <div>
          <Label>Content Type</Label>
          <Select onValueChange={setContentType} defaultValue={contentType}>
            <SelectTrigger data-testid="select-content-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job">Job Posting</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="roadmap">Roadmap</SelectItem>
              <SelectItem value="dsa-problem">DSA Problem</SelectItem>
              <SelectItem value="dsa-topic">DSA Topic</SelectItem>
              <SelectItem value="dsa-company">DSA Company</SelectItem>
              <SelectItem value="dsa-sheet">DSA Sheet</SelectItem>
              <SelectItem value="scholarship">Scholarship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Prompt */}
        <div>
          <Label htmlFor="prompt">Prompt *</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPromptPlaceholder()}
            rows={3}
            className="resize-none"
            data-testid="textarea-prompt"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Be specific about what you want to generate for better results
          </p>
        </div>

        {/* Type-specific fields */}
        {renderTypeSpecificFields()}

        {/* Enhanced Features */}
        <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-lg text-purple-800">Enhanced AI Features</h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="fetchFromWeb"
                  checked={details.fetchFromWeb}
                  onChange={(e) => setDetails({ ...details, fetchFromWeb: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="fetchFromWeb" className="text-sm font-medium cursor-pointer">
                  🌐 Fetch real data from web sources
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeCompanyLogo"
                  checked={details.includeCompanyLogo}
                  onChange={(e) => setDetails({ ...details, includeCompanyLogo: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="includeCompanyLogo" className="text-sm font-medium">
                  🏢 Generate company logos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="generateImages"
                  checked={details.generateImages}
                  onChange={(e) => setDetails({ ...details, generateImages: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="generateImages" className="text-sm font-medium">
                  🖼️ Generate relevant images
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="generateWorkflows"
                  checked={details.generateWorkflows}
                  onChange={(e) => setDetails({ ...details, generateWorkflows: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="generateWorkflows" className="text-sm font-medium">
                  ⚡ Create workflow diagrams
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="generateMindmaps"
                  checked={details.generateMindmaps}
                  onChange={(e) => setDetails({ ...details, generateMindmaps: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="generateMindmaps" className="text-sm font-medium">
                  🧠 Generate mindmaps
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeAnimations"
                  checked={details.includeAnimations}
                  onChange={(e) => setDetails({ ...details, includeAnimations: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="includeAnimations" className="text-sm font-medium">
                  ✨ Add animations & transitions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="customStyling"
                  checked={details.customStyling}
                  onChange={(e) => setDetails({ ...details, customStyling: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="customStyling" className="text-sm font-medium">
                  🎨 Apply custom styling
                </Label>
              </div>
            </div>
          </div>

          {(contentType === 'job' || contentType === 'internship') && (
            <div>
              <Label htmlFor="location" className="font-medium">Location Focus</Label>
              <Input
                value={details.location}
                onChange={(e) => setDetails({ ...details, location: e.target.value })}
                placeholder="e.g., India, Bangalore, Remote"
                className="text-sm mt-2"
              />
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full"
          size="lg"
          data-testid="button-generate"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate with AI
            </>
          )}
        </Button>

        {/* Features */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </Badge>
            <Badge variant="secondary">Instant Results</Badge>
            <Badge variant="secondary">Professional Quality</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Our AI generates professional, detailed content with images, logos, and visual assets based on your requirements. 
            Review and edit the generated content before publishing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}