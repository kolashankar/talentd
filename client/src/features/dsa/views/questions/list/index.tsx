import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { 
  Search,
  CheckCircle2,
  Circle,
  Youtube,
  Code as CodeIcon,
  LayoutDashboard,
  Code,
  BookOpen,
  Building2,
  FileText
} from "lucide-react";

interface DsaProblem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags?: string[];
  topicIds?: number[];
  companyIds?: number[];
  companies?: string[];
  leetcodeUrl?: string;
  videoUrl?: string;
  status?: string;
  acceptanceRate?: number;
}

export default function DsaQuestions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  
  const { data: problems = [], isLoading } = useQuery<DsaProblem[]>({ 
    queryKey: ['/api/dsa-problems'] 
  });

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const easyCount = problems.filter(p => p.difficulty === 'easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'hard').length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="dsa-questions-page">
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-dashboard">
              <Link href="/dsa-corner">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap" 
              asChild
              data-testid="button-nav-questions"
            >
              <Link href="/dsa-corner/questions">
                <Code className="h-4 w-4 mr-2" />
                Questions
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-topics">
              <Link href="/dsa-corner/topics">
                <BookOpen className="h-4 w-4 mr-2" />
                Topics
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-companies">
              <Link href="/dsa-corner/companies">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-sheets">
              <Link href="/dsa-corner/sheets">
                <FileText className="h-4 w-4 mr-2" />
                Sheets
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Header Section - Blue Theme */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">Data Structures & Algorithms</h1>
          <p className="text-xl text-blue-50 mb-8" data-testid="text-page-subtitle">
            Practice {problems.length.toLocaleString()}+ coding problems from top companies. Master DSA concepts and ace your interviews.
          </p>

          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold" data-testid="text-stat-total">{problems.length.toLocaleString()}</div>
              <div className="text-sm text-blue-100">Problems</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold" data-testid="text-stat-easy">{easyCount}</div>
              <div className="text-sm text-blue-100">Easy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold" data-testid="text-stat-medium">{mediumCount}</div>
              <div className="text-sm text-blue-100">Medium</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold" data-testid="text-stat-hard">{hardCount}</div>
              <div className="text-sm text-blue-100">Hard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-problems"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={difficultyFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('all')}
              className={difficultyFilter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              data-testid="button-filter-all"
            >
              All
            </Button>
            <Button
              variant={difficultyFilter === 'easy' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('easy')}
              className={difficultyFilter === 'easy' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              data-testid="button-filter-easy"
            >
              Easy
            </Button>
            <Button
              variant={difficultyFilter === 'medium' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('medium')}
              className={difficultyFilter === 'medium' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              data-testid="button-filter-medium"
            >
              Medium
            </Button>
            <Button
              variant={difficultyFilter === 'hard' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('hard')}
              className={difficultyFilter === 'hard' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              data-testid="button-filter-hard"
            >
              Hard
            </Button>
          </div>
        </div>

        {/* Problems Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Title</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Video</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Leetcode</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Solve</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Companies</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Topics</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        Loading problems...
                      </td>
                    </tr>
                  ) : filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No problems found
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem, index) => (
                      <tr key={problem.id} className="hover:bg-muted/50 transition-colors" data-testid={`row-problem-${problem.id}`}>
                        <td className="px-4 py-4">
                          {problem.status === 'solved' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" data-testid={`icon-solved-${problem.id}`} />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" data-testid={`icon-unsolved-${problem.id}`} />
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Link href={`/dsa-corner/questions/${problem.id}`}>
                            <a className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors" data-testid={`link-problem-${problem.id}`}>
                              {index + 1}. {problem.title}
                            </a>
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {problem.videoUrl && (
                            <a href={problem.videoUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-video-${problem.id}`}>
                              <Youtube className="h-5 w-5 text-red-600 hover:text-red-700 mx-auto" />
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {problem.leetcodeUrl && (
                            <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-leetcode-${problem.id}`}>
                              <CodeIcon className="h-5 w-5 text-blue-600 hover:text-blue-700 mx-auto" />
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Link href={`/dsa-corner/questions/${problem.id}`}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                              data-testid={`button-solve-${problem.id}`}
                            >
                              Solve
                            </Button>
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={getDifficultyColor(problem.difficulty)} data-testid={`badge-difficulty-${problem.id}`}>
                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {problem.companies?.slice(0, 2).map((company, i) => (
                              <Badge key={i} variant="outline" className="text-xs" data-testid={`badge-company-${problem.id}-${i}`}>
                                {company}
                              </Badge>
                            ))}
                            {(problem.companies?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(problem.companies?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {problem.tags?.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs" data-testid={`badge-tag-${problem.id}-${i}`}>
                                {tag}
                              </Badge>
                            ))}
                            {(problem.tags?.length || 0) > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{(problem.tags?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
