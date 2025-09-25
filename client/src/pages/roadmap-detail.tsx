
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  CheckCircle, 
  Circle,
  Star,
  Users,
  BookOpen,
  PlayCircle,
  Download,
  Share2,
  ExternalLink
} from "lucide-react";

interface RoadmapStep {
  title: string;
  description: string;
  resources: string[];
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  technologies: string[];
  steps: RoadmapStep[];
  rating: number;
  enrolledCount: number;
  createdAt: string;
  image?: string;
}

export default function RoadmapDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [learningMode, setLearningMode] = useState(false);

  const { data: roadmap, isLoading, error } = useQuery<Roadmap>({
    queryKey: [`/api/roadmaps/${id}`],
    enabled: !!id,
    retry: 3,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  const progress = roadmap ? (completedSteps.size / roadmap.steps.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Roadmap not found</h2>
          <p className="text-muted-foreground mb-6">The roadmap you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/roadmaps')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roadmaps
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation('/roadmaps')}
          data-testid="back-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roadmaps
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                {/* Featured Image */}
                {roadmap.image ? (
                  <div className="w-full h-48 mb-6">
                    <img 
                      src={roadmap.image} 
                      alt={roadmap.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-6 flex items-center justify-center">
                    <Target className="h-16 w-16 text-primary" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant="secondary" 
                    className={getDifficultyColor(roadmap.difficulty)}
                    data-testid="roadmap-difficulty"
                  >
                    {roadmap.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">{roadmap.estimatedTime}</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4" data-testid="roadmap-title">
                  {roadmap.title}
                </h1>

                <p className="text-muted-foreground mb-6" data-testid="roadmap-description">
                  {roadmap.description}
                </p>

                {/* Technologies */}
                {roadmap.technologies && roadmap.technologies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.technologies.map((tech, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          data-testid={`technology-${index}`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < (roadmap.rating || 0) ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span>{roadmap.rating || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{roadmap.enrolledCount || 0} enrolled</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Progress */}
            {isEnrolled && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Completed Steps</span>
                      <span>{completedSteps.size} / {roadmap.steps.length}</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      {progress.toFixed(0)}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>About This Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {roadmap.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Steps */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Learning Path</CardTitle>
                {isEnrolled && !learningMode && (
                  <Button 
                    onClick={() => setLearningMode(true)}
                    variant="outline"
                    size="sm"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Enter Learning Mode
                  </Button>
                )}
                {learningMode && (
                  <Button 
                    onClick={() => setLearningMode(false)}
                    variant="outline"
                    size="sm"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Exit Learning Mode
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {learningMode && isEnrolled ? (
                  // Interactive Learning Mode
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Step {currentStep + 1} of {roadmap.steps.length}
                      </h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                          disabled={currentStep === 0}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentStep(Math.min(roadmap.steps.length - 1, currentStep + 1))}
                          disabled={currentStep === roadmap.steps.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                    
                    {roadmap.steps[currentStep] && (
                      <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={completedSteps.has(currentStep)}
                              onCheckedChange={() => toggleStepCompletion(currentStep)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold mb-3">
                                {roadmap.steps[currentStep].title}
                              </h4>
                              <p className="text-muted-foreground mb-4 leading-relaxed">
                                {roadmap.steps[currentStep].description}
                              </p>
                              
                              {roadmap.steps[currentStep].resources && roadmap.steps[currentStep].resources.length > 0 && (
                                <div className="bg-card p-4 rounded-lg">
                                  <h5 className="font-medium mb-3 flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Learning Resources
                                  </h5>
                                  <ul className="space-y-2">
                                    {roadmap.steps[currentStep].resources.map((resource, resourceIndex) => (
                                      <li key={resourceIndex} className="flex items-center p-2 bg-muted/50 rounded">
                                        <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                                        <span className="text-sm">{resource}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="mt-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Badge variant={completedSteps.has(currentStep) ? "default" : "secondary"}>
                                    {completedSteps.has(currentStep) ? "Completed" : "In Progress"}
                                  </Badge>
                                </div>
                                
                                {currentStep < roadmap.steps.length - 1 && (
                                  <Button
                                    onClick={() => {
                                      if (!completedSteps.has(currentStep)) {
                                        toggleStepCompletion(currentStep);
                                      }
                                      setCurrentStep(currentStep + 1);
                                    }}
                                  >
                                    Complete & Continue
                                  </Button>
                                )}
                                
                                {currentStep === roadmap.steps.length - 1 && completedSteps.size === roadmap.steps.length && (
                                  <Badge variant="default" className="bg-green-600">
                                    🎉 Roadmap Completed!
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  // Default View
                  <div className="space-y-6">
                    {roadmap.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex gap-4 p-4 border rounded-lg transition-all ${
                          learningMode && index === currentStep ? 'border-primary bg-primary/5' : ''
                        }`}
                        data-testid={`step-${index}`}
                      >
                        {isEnrolled ? (
                          <Checkbox
                            checked={completedSteps.has(index)}
                            onCheckedChange={() => toggleStepCompletion(index)}
                            className="mt-1"
                            data-testid={`step-checkbox-${index}`}
                          />
                        ) : (
                          <Circle className="h-5 w-5 mt-1 text-muted-foreground" />
                        )}
                        
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">
                            Step {index + 1}: {step.title}
                          </h4>
                          <p className="text-muted-foreground mb-3">
                            {step.description}
                          </p>
                          
                          {step.resources && step.resources.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Resources:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {step.resources.map((resource, resourceIndex) => (
                                  <li key={resourceIndex} className="flex items-center">
                                    <BookOpen className="h-3 w-3 mr-2" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="pt-6">
                {!isEnrolled ? (
                  <div className="text-center">
                    <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Start Your Journey</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enroll in this roadmap to track your progress and access interactive features.
                    </p>
                    <Button 
                      className="w-full mb-3"
                      onClick={() => {
                        setIsEnrolled(true);
                        setLearningMode(true);
                        setCurrentStep(0);
                      }}
                      data-testid="enroll-button"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Learning
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">You're Enrolled!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Continue your learning journey.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full mb-3"
                      onClick={() => setLearningMode(true)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Steps</span>
                  <span className="font-medium">{roadmap.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge 
                    variant="secondary" 
                    className={getDifficultyColor(roadmap.difficulty)}
                  >
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{roadmap.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{roadmap.rating || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
