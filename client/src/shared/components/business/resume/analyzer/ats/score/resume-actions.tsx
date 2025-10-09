
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeActionsProps {
  resumeUrl: string;
  resumeText: string;
  analysisData: any;
}

export function ResumeActions({ resumeUrl, resumeText, analysisData }: ResumeActionsProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [showImproved, setShowImproved] = useState(false);
  const [improvedResume, setImprovedResume] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownloadOriginal = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'resume_original.pdf';
    link.click();
    
    toast({
      title: "Download Started",
      description: "Your original resume is downloading",
    });
  };

  const handleGenerateImproved = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/resume/generate-improved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          originalText: resumeText,
          suggestions: analysisData.suggestions,
          keywordMatches: analysisData.keywordMatches,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate improved resume');

      const data = await response.json();
      setImprovedResume(data.improvedResume);
      setShowImproved(true);

      toast({
        title: "Success",
        description: "Improved resume generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate improved resume",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImproved = () => {
    if (!improvedResume) return;

    const blob = new Blob([improvedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume_improved.txt';
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Your improved resume has been downloaded",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleDownloadOriginal} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Original
        </Button>

        <Button onClick={() => setShowOriginal(true)} variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          View Original
        </Button>

        <Button 
          onClick={handleGenerateImproved} 
          disabled={isGenerating}
          className="bg-gradient-to-r from-primary to-accent"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Improved Version
            </>
          )}
        </Button>

        {improvedResume && (
          <Button onClick={handleDownloadImproved} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Improved
          </Button>
        )}
      </div>

      {/* Original Resume Modal */}
      <Dialog open={showOriginal} onOpenChange={setShowOriginal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Original Resume</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <iframe 
              src={resumeUrl} 
              className="w-full h-[600px] border rounded"
              title="Original Resume"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Improved Resume Modal */}
      <Dialog open={showImproved} onOpenChange={setShowImproved}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Improved Resume</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="bg-muted p-6 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {improvedResume}
              </pre>
            </div>
            <Button onClick={handleDownloadImproved} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Improved Resume
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
