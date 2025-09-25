
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Wand2, 
  Download, 
  Loader2,
  Sparkles,
  FileText,
  Image,
  Palette,
  Workflow
} from "lucide-react";

export function AIPortfolioAssistant() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate your portfolio.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/portfolio/generate-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const result = await response.json();
      setGeneratedContent(result);
      
      toast({
        title: "Portfolio Generated!",
        description: "Your AI-powered portfolio has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate portfolio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/portfolio/download/${Date.now()}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-portfolio.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your portfolio is being downloaded as an HTML file.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download portfolio. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span>AI Portfolio Assistant</span>
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="prompt">Describe Your Ideal Portfolio</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Create a modern portfolio for a full-stack developer with React expertise, including animations, professional styling, and project showcases..."
              rows={4}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Be specific about your role, skills, design preferences, and any special features you want.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">AI Features Included:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Image className="h-4 w-4 text-primary" />
                  <span>AI-Generated Images & Logos</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Palette className="h-4 w-4 text-primary" />
                  <span>Custom Color Schemes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Wand2 className="h-4 w-4 text-primary" />
                  <span>Modern Animations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Workflow className="h-4 w-4 text-primary" />
                  <span>Interactive Workflows</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Generated Content:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-secondary" />
                  <span>Professional Bio & Descriptions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Bot className="h-4 w-4 text-secondary" />
                  <span>Skill Recommendations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>Project Ideas & Templates</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Download className="h-4 w-4 text-secondary" />
                  <span>Ready-to-Deploy Code</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate AI Portfolio
                </>
              )}
            </Button>
            
            {generatedContent && (
              <Button 
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Generated Portfolio Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">Portfolio Generated Successfully!</h3>
                <p className="text-muted-foreground">
                  Your AI-powered portfolio has been created with modern design, animations, and professional content.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download HTML
                  </Button>
                  <Button variant="outline">
                    <Bot className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
