import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "@/components/ui/file-upload";
import { ATSAnalyzer } from "@/components/resume/ats-analyzer";
import { GoogleAuth } from "@/components/auth/google-auth";
import { ScrollAnimations } from "@/components/animations/scroll-animations";
import { ParallaxHero } from "@/components/animations/parallax-hero";
import { useToast } from "@/hooks/use-toast";
import { ResumeAnalysis } from "@shared/schema";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Target,
  Eye,
  Download,
  Sparkles,
  BarChart3
} from "lucide-react";

export default function ResumeReview() {
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  // Check authentication status
  const { data: authStatus, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['/api/auth/status'],
    queryFn: async () => {
      const response = await fetch('/api/auth/status', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to check auth status');
      return response.json();
    },
    retry: false,
  });

  const { data: previousAnalyses = [] } = useQuery<ResumeAnalysis[]>({
    queryKey: ['/api/resume/analyses'],
    enabled: authStatus?.authenticated,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Analysis failed' }));
        throw new Error(error.message || 'Analysis failed');
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAnalyze = () => {
    if (!authStatus?.authenticated) {
      setShowAuthDialog(true);
      toast({
        title: "Sign In Required",
        description: "Please sign in to analyze your resume",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a resume file to analyze",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription);
    }

    analyzeMutation.mutate(formData);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: string | number) => {
    const scoreString = String(score).toLowerCase();
    switch (scoreString) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'very good':
        return <Badge className="bg-blue-100 text-blue-800">Very Good</Badge>;
      case 'good':
        return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
      case 'fair':
        return <Badge className="bg-orange-100 text-orange-800">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
      default:
        return <Badge variant="secondary">{score}</Badge>;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!authStatus?.authenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <ParallaxHero
          backgroundImage="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&h=1560"
          overlay="rgba(15, 23, 42, 0.8)"
          className="h-96"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="text-center">
              <ScrollAnimations>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 fade-in-up">
                  AI Resume Reviewer
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto fade-in-up">
                  Get instant feedback on your resume with our advanced ATS analysis system
                </p>
              </ScrollAnimations>
            </div>
          </div>
        </ParallaxHero>

        {/* Auth Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimations>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 fade-in-up">
                  Sign In to Analyze Your Resume
                </h2>
                <p className="text-muted-foreground fade-in-up">
                  Get personalized ATS feedback and improvement suggestions
                </p>
              </div>
              <div className="max-w-md mx-auto fade-in-up">
                <GoogleAuth 
                  showDialog={showAuthDialog}
                  onClose={() => setShowAuthDialog(false)}
                />
              </div>
            </ScrollAnimations>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ParallaxHero
        backgroundImage="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&h=1560"
        overlay="rgba(15, 23, 42, 0.8)"
        className="h-96"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <ScrollAnimations>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 fade-in-up" data-testid="heading-resume-review">
                AI Resume Reviewer
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto fade-in-up" style={{"--stagger": "1"} as any}>
                Get instant feedback on your resume with our advanced ATS analysis system
              </p>
              <div className="flex items-center justify-center space-x-8 text-white fade-in-up" style={{"--stagger": "2"} as any}>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-accent" />
                  <span>ATS Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <span>Instant Results</span>
                </div>
              </div>
            </ScrollAnimations>
          </div>
        </div>
      </ParallaxHero>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upload Section */}
            <div>
              <ScrollAnimations>
                <Card className="fade-in-up" data-testid="upload-section">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2" data-testid="upload-title">
                      <Upload className="h-5 w-5" />
                      <span>Upload Your Resume</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* File Upload */}
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      acceptedTypes={['.pdf', '.doc', '.docx']}
                      maxSize={5 * 1024 * 1024} // 5MB
                      data-testid="file-upload"
                    />

                    {selectedFile && (
                      <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg" data-testid="selected-file-info">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}

                    {/* Job Description (Optional) */}
                    <div>
                      <label className="block text-sm font-medium mb-2" data-testid="job-description-label">
                        Job Description (Optional)
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here for better keyword matching analysis..."
                        className="w-full h-32 px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        data-testid="job-description-textarea"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Adding a job description will help us provide more targeted keyword suggestions
                      </p>
                    </div>

                    {/* Analyze Button */}
                    <Button 
                      onClick={handleAnalyze}
                      disabled={!selectedFile || analyzeMutation.isPending}
                      className="w-full"
                      size="lg"
                      data-testid="button-analyze"
                    >
                      {analyzeMutation.isPending ? (
                        <>
                          <div className="spinner mr-2" />
                          Analyzing Resume...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="mr-2 h-5 w-5" />
                          Analyze Resume
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Features */}
                <ScrollAnimations>
                  <Card className="mt-6 fade-in-up" style={{"--stagger": "1"} as any} data-testid="features-card">
                    <CardHeader>
                      <CardTitle className="text-lg">What You'll Get</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          "ATS Compatibility Score (0-100)",
                          "Keyword Match Analysis",
                          "Format & Structure Review",
                          "Personalized Improvement Tips",
                          "Industry-Specific Suggestions"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3" data-testid={`feature-${index}`}>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimations>
              </ScrollAnimations>
            </div>

            {/* Results Section */}
            <div>
              {analysisResult ? (
                <ATSAnalyzer analysis={analysisResult} />
              ) : (
                <ScrollAnimations>
                  <Card className="fade-in-up" data-testid="preview-card">
                    <CardHeader>
                      <CardTitle>Resume Analysis Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Mock ATS Score */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">ATS Score</h3>
                            <span className="text-2xl font-bold text-accent">--</span>
                          </div>
                          <Progress value={0} className="h-3" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload your resume to see your ATS compatibility score
                          </p>
                        </div>

                        {/* Mock Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-semibold text-muted-foreground">--/--</div>
                            <div className="text-xs text-muted-foreground">Keywords</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-semibold text-muted-foreground">--</div>
                            <div className="text-xs text-muted-foreground">Format Score</div>
                          </div>
                        </div>

                        {/* Mock Suggestions */}
                        <div>
                          <h4 className="font-medium mb-3">Analysis Preview</h4>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                Detailed keyword analysis will appear here
                              </span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                Format and structure feedback will be provided
                              </span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm text-muted-foreground">
                                Personalized improvement suggestions included
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimations>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Previous Analyses */}
      {previousAnalyses.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimations>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 fade-in-up" data-testid="heading-previous-analyses">
                  Previous Analyses
                </h2>
                <p className="text-muted-foreground fade-in-up" data-testid="text-previous-subtitle">
                  Track your resume improvement over time
                </p>
              </div>
            </ScrollAnimations>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousAnalyses.slice(0, 6).map((analysis, index) => (
                <ScrollAnimations key={analysis.id}>
                  <Card className="fade-in-up card-hover" style={{"--stagger": index + 1} as any} data-testid={`previous-analysis-${analysis.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm" data-testid={`analysis-filename-${analysis.id}`}>
                              {analysis.fileName}
                            </p>
                            <p className="text-xs text-muted-foreground" data-testid={`analysis-date-${analysis.id}`}>
                              {new Date(analysis.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(analysis.atsScore || 0)}`} data-testid={`analysis-score-${analysis.id}`}>
                            {analysis.atsScore || 0}%
                          </div>
                          <div className="text-xs text-muted-foreground">ATS Score</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Format:</span>
                          {getScoreBadge(analysis.formatScore || 'N/A')}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Readability:</span>
                          {getScoreBadge(analysis.readabilityScore || 'N/A')}
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-analysis-${analysis.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollAnimations>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
