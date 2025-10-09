import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Circle, Code, BookOpen, Building2, FileText, LayoutDashboard } from "lucide-react";

interface DsaCompany {
  id: number;
  name: string;
  description: string;
  logo?: string;
  problemCount: number;
}

interface DsaProblem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  status?: string;
  acceptanceRate?: number;
  leetcodeUrl?: string;
}

export default function DsaCompanyDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: company, isLoading: companyLoading } = useQuery<DsaCompany>({
    queryKey: [`/api/dsa-companies/${id}`],
    enabled: !!id,
  });

  const { data: problems = [], isLoading: problemsLoading } = useQuery<DsaProblem[]>({
    queryKey: [`/api/dsa-companies/${id}/problems`],
    enabled: !!id,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Company not found</h2>
          <Button onClick={() => setLocation('/dsa-corner/companies')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            <Button variant="ghost" className="whitespace-nowrap" asChild>
              <Link href="/dsa-corner">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild>
              <Link href="/dsa-corner/questions">
                <Code className="h-4 w-4 mr-2" />
                Questions
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild>
              <Link href="/dsa-corner/topics">
                <BookOpen className="h-4 w-4 mr-2" />
                Topics
              </Link>
            </Button>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap" asChild>
              <Link href="/dsa-corner/companies">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild>
              <Link href="/dsa-corner/sheets">
                <FileText className="h-4 w-4 mr-2" />
                Sheets
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => setLocation('/dsa-corner/companies')}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
          <div className="flex items-center gap-4 mb-4">
            {company.logo && (
              <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-lg bg-white p-2" />
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-company-name">{company.name}</h1>
            </div>
          </div>
          <p className="text-xl text-blue-50 mb-6" data-testid="text-company-description">{company.description}</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
            <div className="text-2xl font-bold" data-testid="text-problem-count">{problems.length}</div>
            <div className="text-sm text-blue-100">Problems Asked</div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Problems Asked by {company.name}</h2>
        
        {problemsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          </div>
        ) : problems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No problems found for this company yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {problems.map((problem) => (
              <Card key={problem.id} className="hover:shadow-lg transition-shadow" data-testid={`card-problem-${problem.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {problem.status === 'solved' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <Link href={`/dsa-corner/questions/${problem.id}`}>
                          <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors" data-testid={`text-problem-title-${problem.id}`}>
                            {problem.title}
                          </h3>
                        </Link>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">{problem.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        {problem.acceptanceRate && (
                          <Badge variant="outline">
                            {problem.acceptanceRate}% Acceptance
                          </Badge>
                        )}
                      </div>
                    </div>
                    {problem.leetcodeUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer">
                          Practice
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
