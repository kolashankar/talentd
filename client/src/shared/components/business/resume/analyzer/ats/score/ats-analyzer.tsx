import { ResumeAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertTriangle,
  Target,
  FileText,
  TrendingUp,
  Download,
  Eye,
  Lightbulb,
  Building2,
  Brain,
  Award,
  Clock,
  AlertCircle,
  Star,
  DollarSign,
  BarChart3,
} from "lucide-react";

interface ATSAnalyzerProps {
  analysis: ResumeAnalysis;
}

export function ATSAnalyzer({ analysis }: ATSAnalyzerProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBadge = (score: string | number) => {
    const scoreString = String(score);
    const lowerScore = scoreString.toLowerCase();
    const variants = {
      excellent: {
        variant: "default" as const,
        className: "bg-green-100 text-green-800",
      },
      "very good": {
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
      },
      good: {
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800",
      },
      fair: {
        variant: "secondary" as const,
        className: "bg-orange-100 text-orange-800",
      },
      poor: {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800",
      },
    };

    const config = variants[lowerScore as keyof typeof variants] || {
      variant: "secondary" as const,
      className: "",
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {scoreString}
      </Badge>
    );
  };

  return (
    <div className="space-y-6" data-testid="ats-analyzer">
      {/* Main ATS Score */}
      <Card data-testid="ats-score-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>ATS Compatibility Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div
              className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.atsScore)}`}
              data-testid="ats-score-value"
            >
              {analysis.atsScore}%
            </div>
            <Progress
              value={analysis.atsScore}
              className="h-3 mb-2"
              data-testid="ats-score-progress"
            />
            <p className="text-sm text-muted-foreground">
              {analysis.atsScore >= 80
                ? "Excellent! Your resume is highly ATS-compatible"
                : analysis.atsScore >= 60
                  ? "Good score, but there's room for improvement"
                  : "Needs improvement to pass ATS systems"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold" data-testid="format-score">
                {getScoreBadge(analysis.formatScore)}
              </div>
              <div className="text-xs text-muted-foreground">
                Format Quality
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div
                className="text-lg font-semibold"
                data-testid="readability-score"
              >
                {getScoreBadge(analysis.readabilityScore)}
              </div>
              <div className="text-xs text-muted-foreground">Readability</div>
            </div>
            {analysis.experienceAnalysis && (
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">
                  {analysis.experienceAnalysis.totalYears}+
                </div>
                <div className="text-xs text-muted-foreground">
                  Years Experience
                </div>
              </div>
            )}
            {analysis.industryInsights && (
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">
                  <Building2 className="h-4 w-4 mx-auto" />
                </div>
                <div className="text-xs text-muted-foreground">
                  {analysis.industryInsights.detectedIndustry}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Analysis Tabs */}
      <Tabs defaultValue="keywords" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="industry">Industry</TabsTrigger>
          <TabsTrigger value="priorities">Priorities</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          {/* Keyword Analysis */}
          {analysis.keywordMatches && (
            <Card data-testid="keyword-analysis-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Keyword Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Keywords Matched</span>
                    <Badge
                      className="bg-green-100 text-green-800"
                      data-testid="keywords-matched"
                    >
                      {analysis.keywordMatches.matched.length}/
                      {analysis.keywordMatches.total}
                    </Badge>
                  </div>

                  {analysis.keywordMatches.matched.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Found Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywordMatches.matched.map(
                          (keyword, index) => (
                            <Badge
                              key={index}
                              variant="default"
                              className="bg-green-100 text-green-800 text-xs"
                              data-testid={`matched-keyword-${index}`}
                            >
                              {keyword}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {analysis.keywordMatches.missing.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-orange-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywordMatches.missing.map(
                          (keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-orange-200 text-orange-800 text-xs"
                              data-testid={`missing-keyword-${index}`}
                            >
                              {keyword}
                            </Badge>
                          ),
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Consider adding these keywords to improve your match
                        rate
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          {/* Skills Analysis */}
          {analysis.skillsAnalysis && (
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Technical Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.skillsAnalysis.technicalSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {analysis.skillsAnalysis.technicalSkills.map(
                          (skill, index) => (
                            <Badge
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs"
                            >
                              {skill}
                            </Badge>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No technical skills detected
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Soft Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.skillsAnalysis.softSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {analysis.skillsAnalysis.softSkills.map(
                          (skill, index) => (
                            <Badge
                              key={index}
                              className="bg-purple-100 text-purple-800 text-xs"
                            >
                              {skill}
                            </Badge>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No soft skills detected
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {analysis.skillsAnalysis.missingSkills.length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <span>Recommended Skills to Add</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skillsAnalysis.missingSkills.map(
                        (skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-orange-200 text-orange-800 text-xs"
                          >
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="industry" className="space-y-4">
          {/* Industry Insights */}
          {analysis.industryInsights && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Industry Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Detected Industry</h4>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        {analysis.industryInsights.detectedIndustry}
                      </Badge>
                    </div>

                    {analysis.industryInsights.industrySpecificTips.length >
                      0 && (
                      <div>
                        <h4 className="font-medium mb-2">
                          Industry-Specific Tips
                        </h4>
                        <div className="space-y-2">
                          {analysis.industryInsights.industrySpecificTips.map(
                            (tip, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg"
                              >
                                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{tip}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {analysis.industryInsights.salaryInsights && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Salary Insights
                        </h4>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            {analysis.industryInsights.salaryInsights}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {analysis.experienceAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Experience Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Total Experience
                          </h4>
                          <p className="text-2xl font-bold text-blue-600">
                            {analysis.experienceAnalysis.totalYears}+ years
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Career Progression
                          </h4>
                          <p className="text-sm">
                            {analysis.experienceAnalysis.careerProgression}
                          </p>
                        </div>
                      </div>

                      {analysis.experienceAnalysis.gapAnalysis.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Gap Analysis</h4>
                          <div className="space-y-2">
                            {analysis.experienceAnalysis.gapAnalysis.map(
                              (gap, index) => (
                                <div
                                  key={index}
                                  className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg"
                                >
                                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{gap}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="priorities" className="space-y-4">
          {/* Improvement Priorities */}
          {analysis.improvementPriority && (
            <div className="space-y-4">
              {analysis.improvementPriority.critical.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span>Critical Issues</span>
                      <Badge variant="destructive" className="text-xs">
                        Fix Now
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.improvementPriority.critical.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg"
                          >
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysis.improvementPriority.important.length > 0 && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Important Improvements</span>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        High Priority
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.improvementPriority.important.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 p-3 bg-orange-50 rounded-lg"
                          >
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysis.improvementPriority.nice_to_have.length > 0 && (
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-700">
                      <Star className="h-5 w-5" />
                      <span>Enhancement Suggestions</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Nice to Have
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.improvementPriority.nice_to_have.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg"
                          >
                            <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* General Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <Card data-testid="suggestions-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>General Improvement Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
                  data-testid={`suggestion-${index}`}
                >
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis */}
      <Card data-testid="detailed-analysis-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Detailed Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p
              className="text-muted-foreground whitespace-pre-wrap"
              data-testid="detailed-analysis-text"
            >
              {analysis.analysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button className="flex-1" data-testid="button-download-report">
          <Download className="mr-2 h-4 w-4" />
          Download Full Report
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          data-testid="button-view-resume"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Original
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          data-testid="button-generate-improved"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Improved Version
        </Button>
      </div>

      {/* Analysis Metadata */}
      <Card className="bg-muted/30" data-testid="analysis-metadata">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">File:</span>
              <p className="font-medium" data-testid="analysis-filename">
                {analysis.filename}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Analyzed:</span>
              <p className="font-medium" data-testid="analysis-date">
                {new Date(analysis.createdAt!).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
