
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, 
  Wand2, 
  Loader2, 
  Download,
  Palette,
  Image,
  Target,
  TrendingUp
} from "lucide-react";

interface AdminAgentProps {
  selectedContent: any;
  contentType: string;
  onTemplateGenerated?: (template: any) => void;
}

export function AdminAgent({ selectedContent, contentType, onTemplateGenerated }: AdminAgentProps) {
  const [templateType, setTemplateType] = useState("social-media");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const { toast } = useToast();

  const generateTemplateMutation = useMutation({
    mutationFn: async (data: { content: any; type: string; templateType: string; prompt: string }) => {
      const response = await apiRequest('POST', '/api/admin/generate-template', data);
      return await response.json();
    },
    onSuccess: (result) => {
      setGeneratedTemplate(result);
      onTemplateGenerated?.(result);
      toast({
        title: "Template Generated!",
        description: "Advertising template with logos and color grading has been created.",
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

  const handleGenerate = () => {
    if (!selectedContent) {
      toast({
        title: "No Content Selected",
        description: "Please select a job, roadmap, or other content first.",
        variant: "destructive",
      });
      return;
    }

    generateTemplateMutation.mutate({
      content: selectedContent,
      type: contentType,
      templateType,
      prompt: customPrompt,
    });
  };

  const downloadTemplate = async () => {
    if (!generatedTemplate) return;

    try {
      const response = await fetch('/api/admin/download-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: generatedTemplate }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateType}-template.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download template files.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple/10 to-blue/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <span>Admin AI Agent - Template Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedContent && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Selected Content:</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{contentType}</Badge>
              <span className="text-sm">{selectedContent.title || selectedContent.name}</span>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">Template Type</label>
          <Select value={templateType} onValueChange={setTemplateType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social-media">Social Media Post</SelectItem>
              <SelectItem value="banner">Web Banner</SelectItem>
              <SelectItem value="flyer">Digital Flyer</SelectItem>
              <SelectItem value="infographic">Infographic</SelectItem>
              <SelectItem value="presentation">Presentation Slide</SelectItem>
              <SelectItem value="email">Email Template</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Custom Requirements</label>
          <Textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Specify design preferences, colors, style, target audience..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={generateTemplateMutation.isPending || !selectedContent}
          className="w-full"
          size="lg"
        >
          {generateTemplateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Template...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Advertising Template
            </>
          )}
        </Button>

        {generatedTemplate && (
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Template Generated!</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Files
              </Button>
              <Button variant="outline">
                <Image className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Generated Assets:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Palette className="mr-1 h-3 w-3" />
                  Custom Colors
                </Badge>
                <Badge variant="secondary">
                  <Image className="mr-1 h-3 w-3" />
                  Logos & Graphics
                </Badge>
                <Badge variant="secondary">
                  <Target className="mr-1 h-3 w-3" />
                  Brand Guidelines
                </Badge>
                <Badge variant="secondary">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Marketing Copy
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
