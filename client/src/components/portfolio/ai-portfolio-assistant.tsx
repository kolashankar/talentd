
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Wand2, 
  Download, 
  Loader2, 
  Eye,
  Code,
  Palette,
  Globe,
  FileCode,
  Folder,
  Image,
  Sparkles,
  Zap
} from "lucide-react";

interface AIPortfolioAssistantProps {
  onPortfolioGenerated?: (portfolioData: any) => void;
}

export function AIPortfolioAssistant({ onPortfolioGenerated }: AIPortfolioAssistantProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [websiteStyle, setWebsiteStyle] = useState("modern");
  const [colorScheme, setColorScheme] = useState("blue");
  const [includeAnimations, setIncludeAnimations] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeLogos, setIncludeLogos] = useState(true);
  const [includeWorkflows, setIncludeWorkflows] = useState(false);
  const [includeMindmaps, setIncludeMindmaps] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<any>(null);
  const [portfolioCode, setPortfolioCode] = useState<any>(null);
  const { toast } = useToast();

  const generatePortfolioMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      if (data.resumeFile) {
        formData.append('resume', data.resumeFile);
      }
      
      const portfolioPrompt = `Create a stunning portfolio website with the following specifications:
        Style: ${data.websiteStyle}
        Color Scheme: ${data.colorScheme}
        Custom Requirements: ${data.prompt}
        Include Animations: ${data.includeAnimations}
        Include Images: ${data.includeImages}
        Include Logos: ${data.includeLogos}
        Include Workflows: ${data.includeWorkflows}
        Include Mindmaps: ${data.includeMindmaps}
        
        Generate a complete, modern, responsive portfolio with:
        - Beautiful UI/UX design
        - Professional animations and transitions
        - High-quality images and graphics
        - Company logos for experience
        - Interactive elements
        - Mobile-responsive design
        - SEO optimized
        - Fast loading performance`;
        
      formData.append('prompt', portfolioPrompt);

      const response = await fetch('/api/portfolio/generate-complete', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to generate portfolio');
      return await response.json();
    },
    onSuccess: (result) => {
      setGeneratedPortfolio(result.portfolioData);
      setPortfolioCode(result.portfolioCode);
      onPortfolioGenerated?.(result.portfolioData);
      toast({
        title: "Portfolio Generated!",
        description: "Your AI-powered portfolio website has been created with stunning visuals and animations.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadPortfolioMutation = useMutation({
    mutationFn: async () => {
      if (!portfolioCode) throw new Error('No portfolio code available');
      
      const response = await fetch('/api/portfolio/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioCode }),
      });

      if (!response.ok) throw new Error('Failed to prepare download');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-portfolio-website.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your AI-generated portfolio website is being downloaded.",
      });
    },
  });

  const handleGenerate = () => {
    if (!resumeFile && !prompt.trim()) {
      toast({
        title: "Missing Input",
        description: "Please upload a resume or provide a custom prompt.",
        variant: "destructive",
      });
      return;
    }

    generatePortfolioMutation.mutate({
      resumeFile: resumeFile || undefined,
      prompt,
      websiteStyle,
      colorScheme,
      includeAnimations,
      includeImages,
      includeLogos,
      includeWorkflows,
      includeMindmaps,
    });
  };

  const previewPortfolio = () => {
    if (generatedPortfolio && portfolioCode) {
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(portfolioCode.html);
        previewWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Portfolio Assistant
              </span>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Generate stunning portfolio websites with AI-powered design, images, and animations
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Resume Upload */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Upload Resume (Optional)</Label>
            <FileUpload
              onFileSelect={setResumeFile}
              acceptedTypes={['.pdf', '.doc', '.docx']}
              maxSize={5 * 1024 * 1024}
              className="border-2 border-dashed border-purple-300 hover:border-purple-400"
            />
            {resumeFile && (
              <div className="flex items-center space-x-2 mt-2">
                <FileCode className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Selected: {resumeFile.name}</span>
              </div>
            )}
          </div>

          {/* Custom Prompt */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Portfolio Vision & Requirements</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your ideal portfolio... (e.g., 'Create a modern dark theme portfolio for a full-stack developer with interactive animations, showcasing web development projects with a minimalist design and purple accent colors')"
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Style Customization */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Website Style</Label>
              <Select value={websiteStyle} onValueChange={setWebsiteStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern & Clean</SelectItem>
                  <SelectItem value="creative">Creative & Artistic</SelectItem>
                  <SelectItem value="minimal">Minimal & Professional</SelectItem>
                  <SelectItem value="tech">Tech & Futuristic</SelectItem>
                  <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                  <SelectItem value="playful">Playful & Colorful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold">Color Scheme</Label>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Ocean Blue</SelectItem>
                  <SelectItem value="purple">Royal Purple</SelectItem>
                  <SelectItem value="green">Nature Green</SelectItem>
                  <SelectItem value="orange">Sunset Orange</SelectItem>
                  <SelectItem value="pink">Gradient Pink</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="rainbow">Rainbow Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhanced AI Features */}
          <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-800">AI-Powered Features</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <Label className="font-medium">Smooth Animations</Label>
                  </div>
                  <Switch checked={includeAnimations} onCheckedChange={setIncludeAnimations} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image className="h-4 w-4 text-green-500" />
                    <Label className="font-medium">AI-Generated Images</Label>
                  </div>
                  <Switch checked={includeImages} onCheckedChange={setIncludeImages} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-blue-500" />
                    <Label className="font-medium">Company Logos</Label>
                  </div>
                  <Switch checked={includeLogos} onCheckedChange={setIncludeLogos} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-purple-500" />
                    <Label className="font-medium">Interactive Workflows</Label>
                  </div>
                  <Switch checked={includeWorkflows} onCheckedChange={setIncludeWorkflows} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-orange-500" />
                    <Label className="font-medium">Skill Mindmaps</Label>
                  </div>
                  <Switch checked={includeMindmaps} onCheckedChange={setIncludeMindmaps} />
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={generatePortfolioMutation.isPending || (!resumeFile && !prompt.trim())}
            className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {generatePortfolioMutation.isPending ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                AI is Creating Your Portfolio...
              </>
            ) : (
              <>
                <Wand2 className="mr-3 h-6 w-6" />
                Generate AI Portfolio Website
              </>
            )}
          </Button>

          {/* Generated Portfolio Actions */}
          {generatedPortfolio && portfolioCode && (
            <div className="border-t pt-8">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-xl text-green-700">Portfolio Generated Successfully!</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button onClick={previewPortfolio} variant="outline" className="h-12">
                  <Eye className="mr-2 h-5 w-5" />
                  Preview Website
                </Button>
                <Button 
                  onClick={() => downloadPortfolioMutation.mutate()}
                  disabled={downloadPortfolioMutation.isPending}
                  className="h-12"
                >
                  {downloadPortfolioMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-5 w-5" />
                  )}
                  Download Complete Code
                </Button>
              </div>
              
              {/* Portfolio Features */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <h4 className="font-semibold text-lg mb-4 text-green-800">Generated Features:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Badge variant="secondary" className="flex items-center gap-2 p-2">
                    <Code className="h-4 w-4 text-blue-600" />
                    <span>HTML/CSS/JS</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-2 p-2">
                    <Palette className="h-4 w-4 text-purple-600" />
                    <span>Custom Styling</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-2 p-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span>Responsive Design</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-2 p-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>Smooth Animations</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-2 p-2">
                    <Image className="h-4 w-4 text-pink-600" />
                    <span>AI Images</span>
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-2 p-2">
                    <Folder className="h-4 w-4 text-orange-600" />
                    <span>Complete Structure</span>
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* AI Features Info */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <Bot className="h-3 w-3" />
                AI-Powered Design
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <Zap className="h-3 w-3" />
                Instant Generation
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <Globe className="h-3 w-3" />
                Production Ready
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <Sparkles className="h-3 w-3" />
                Stunning Visuals
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Our AI Portfolio Assistant uses advanced AI to create beautiful, professional portfolio websites 
              with custom animations, high-quality images, company logos, and modern UI/UX design. 
              Perfect for developers, designers, and professionals looking to showcase their work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
