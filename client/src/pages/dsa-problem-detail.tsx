
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Code, 
  Lightbulb, 
  Building2,
  CheckCircle,
  Play,
  RefreshCw,
  Share2,
  BookOpen,
  Timer,
  Zap
} from "lucide-react";

interface DsaProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
  hints: string[];
  companies: string[];
  tags: string[];
  createdAt: string;
}

export default function DsaProblemDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [userSolution, setUserSolution] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const { data: problem, isLoading, error } = useQuery<DsaProblem>({
    queryKey: [`/api/dsa-problems/${id}`],
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCodeContent = (content: string) => {
    return content.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
      return `<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || 'text'}">${code}</code></pre>`;
    });
  };

  const showNextHint = () => {
    if (problem && currentHint < problem.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Problem not found</h2>
          <p className="text-muted-foreground mb-6">The DSA problem you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/dsa')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to DSA Corner
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
          onClick={() => setLocation('/dsa')}
          data-testid="back-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to DSA Corner
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant="secondary" 
                    className={getDifficultyColor(problem.difficulty)}
                    data-testid="problem-difficulty"
                  >
                    {problem.difficulty}
                  </Badge>
                  <Badge variant="outline" data-testid="problem-category">
                    {problem.category}
                  </Badge>
                </div>

                <h1 className="text-2xl font-bold mb-4" data-testid="problem-title">
                  {problem.title}
                </h1>

                {/* Companies */}
                {problem.companies && problem.companies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Asked by</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {problem.companies.map((company, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="text-xs"
                          data-testid={`company-${index}`}
                        >
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complexity */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-muted-foreground">Time: </span>
                    <code className="ml-1 bg-muted px-1 rounded">{problem.timeComplexity}</code>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-muted-foreground">Space: </span>
                    <code className="ml-1 bg-muted px-1 rounded">{problem.spaceComplexity}</code>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Problem Description */}
            <Card>
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatCodeContent(problem.description) }}
                  data-testid="problem-description"
                />
              </CardContent>
            </Card>

            {/* Hints */}
            {problem.hints && problem.hints.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Hints
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                    data-testid="toggle-hints"
                  >
                    {showHints ? 'Hide Hints' : 'Show Hints'}
                  </Button>
                </CardHeader>
                {showHints && (
                  <CardContent>
                    <div className="space-y-4">
                      {problem.hints.slice(0, currentHint + 1).map((hint, index) => (
                        <div 
                          key={index} 
                          className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                          data-testid={`hint-${index}`}
                        >
                          <div className="flex items-start">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm">
                              <strong>Hint {index + 1}:</strong> {hint}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {currentHint < problem.hints.length - 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={showNextHint}
                          data-testid="next-hint"
                        >
                          Show Next Hint
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        data-testid={`tag-${index}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Solution Area */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code">Code Editor</TabsTrigger>
                    <TabsTrigger value="solution">Solution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="code" className="space-y-4">
                    <Textarea
                      placeholder="Write your solution here..."
                      value={userSolution}
                      onChange={(e) => setUserSolution(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      data-testid="code-editor"
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        data-testid="run-code"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Run Code
                      </Button>
                      <Button 
                        variant="outline"
                        data-testid="reset-code"
                        onClick={() => setUserSolution('')}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="solution" className="space-y-4">
                    {!showSolution ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Solution Available</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Try solving the problem first, then view the solution.
                        </p>
                        <Button 
                          onClick={() => setShowSolution(true)}
                          data-testid="show-solution"
                        >
                          View Solution
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div 
                          className="prose max-w-none bg-muted p-4 rounded-lg"
                          dangerouslySetInnerHTML={{ __html: formatCodeContent(problem.solution) }}
                          data-testid="solution-content"
                        />
                        
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Complexity Analysis</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Time Complexity: </span>
                              <code className="bg-muted px-1 rounded">{problem.timeComplexity}</code>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Space Complexity: </span>
                              <code className="bg-muted px-1 rounded">{problem.spaceComplexity}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" data-testid="mark-solved">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Solved
                  </Button>
                  <Button variant="outline" className="flex-1" data-testid="share-problem">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  Star,
  Code,
  Lightbulb,
  CheckCircle,
  Copy,
  ExternalLink
} from "lucide-react";

interface DsaProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solution: string;
  hints: string[];
  timeComplexity: string;
  spaceComplexity: string;
  tags: string[];
  companies: string[];
  createdAt: string;
}

export default function DsaProblemDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showSolution, setShowSolution] = useState(false);
  const [usedHints, setUsedHints] = useState<number[]>([]);

  const { data: problem, isLoading, error } = useQuery<DsaProblem>({
    queryKey: [`/api/dsa-problems/${id}`],
    enabled: !!id,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const showHint = (index: number) => {
    setUsedHints(prev => [...prev, index]);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-muted rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Problem not found</h2>
          <p className="text-muted-foreground mb-6">The DSA problem you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/dsa')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to DSA Corner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation('/dsa')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to DSA Corner
        </Button>

        <div className="space-y-6">
          {/* Problem Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="secondary" 
                  className={getDifficultyColor(problem.difficulty)}
                >
                  {problem.difficulty.toUpperCase()}
                </Badge>
                <Badge variant="outline">{problem.category}</Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Companies */}
              {problem.companies && problem.companies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Asked by:</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company, index) => (
                      <Badge key={index} variant="outline">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Complexity */}
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Time: {problem.timeComplexity}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Space: {problem.spaceComplexity}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Problem Description */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {problem.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          {problem.hints && problem.hints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {problem.hints.map((hint, index) => (
                    <div key={index}>
                      {usedHints.includes(index) ? (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{hint}</p>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showHint(index)}
                        >
                          Show Hint {index + 1}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Solution
                </div>
                {!showSolution && (
                  <Button onClick={() => setShowSolution(true)}>
                    Show Solution
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            {showSolution && (
              <CardContent>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyCode(problem.solution)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{problem.solution}</code>
                  </pre>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Time Complexity</h4>
                    <p className="text-muted-foreground">{problem.timeComplexity}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Space Complexity</h4>
                    <p className="text-muted-foreground">{problem.spaceComplexity}</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
