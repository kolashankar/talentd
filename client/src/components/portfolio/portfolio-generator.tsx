
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  Folder
} from "lucide-react";

interface PortfolioGeneratorProps {
  onPortfolioGenerated?: (portfolioData: any) => void;
}

export function PortfolioGenerator({ onPortfolioGenerated }: PortfolioGeneratorProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedPortfolio, setGeneratedPortfolio] = useState<any>(null);
  const [portfolioCode, setPortfolioCode] = useState<any>(null);
  const { toast } = useToast();

  const generatePortfolioMutation = useMutation({
    mutationFn: async (data: { resumeFile?: File; prompt?: string }) => {
      const formData = new FormData();
      if (data.resumeFile) {
        formData.append('resume', data.resumeFile);
      }
      if (data.prompt) {
        formData.append('prompt', data.prompt);
      }

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
        description: "Your complete portfolio website has been generated with custom styling and animations.",
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
      a.download = 'portfolio-website.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your portfolio website code is being downloaded as a ZIP file.",
      });
    },
  });

  const handleGenerate = () => {
    if (!resumeFile && !customPrompt.trim()) {
      toast({
        title: "Missing Input",
        description: "Please upload a resume or provide a custom prompt.",
        variant: "destructive",
      });
      return;
    }

    generatePortfolioMutation.mutate({
      resumeFile: resumeFile || undefined,
      prompt: customPrompt || undefined,
    });
  };

  const previewPortfolio = () => {
    if (generatedPortfolio && portfolioCode) {
      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(portfolioCode.html);
        previewWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span>AI Portfolio Website Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resume Upload */}
          <div>
            <Label>Upload Resume (Optional)</Label>
            <FileUpload
              onFileSelect={setResumeFile}
              acceptedTypes={['.pdf', '.doc', '.docx']}
              maxSize={5 * 1024 * 1024}
            />
            {resumeFile && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: {resumeFile.name}
              </div>
            )}
          </div>

          {/* Custom Prompt */}
          <div>
            <Label>Custom Portfolio Requirements</Label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your ideal portfolio... (e.g., 'Modern dark theme with animations, showcasing web development projects, minimalist design')"
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={generatePortfolioMutation.isPending}
            className="w-full"
            size="lg"
          >
            {generatePortfolioMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Portfolio...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Complete Portfolio Website
              </>
            )}
          </Button>

          {/* Generated Portfolio Actions */}
          {generatedPortfolio && portfolioCode && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Portfolio Generated Successfully!</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={previewPortfolio} variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Website
                </Button>
                <Button 
                  onClick={() => downloadPortfolioMutation.mutate()}
                  disabled={downloadPortfolioMutation.isPending}
                >
                  {downloadPortfolioMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download Code
                </Button>
              </div>
              
              {/* Portfolio Features */}
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Generated Features:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Code className="mr-1 h-3 w-3" />
                    HTML/CSS/JS
                  </Badge>
                  <Badge variant="secondary">
                    <Palette className="mr-1 h-3 w-3" />
                    Custom Styling
                  </Badge>
                  <Badge variant="secondary">
                    <Globe className="mr-1 h-3 w-3" />
                    Responsive Design
                  </Badge>
                  <Badge variant="secondary">
                    <FileCode className="mr-1 h-3 w-3" />
                    Animations
                  </Badge>
                  <Badge variant="secondary">
                    <Folder className="mr-1 h-3 w-3" />
                    5-Level Structure
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
