
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DsaProblem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags?: string[];
  companies?: string[];
  leetcodeUrl?: string;
  videoUrl?: string;
  status?: string;
}

export default function DsaQuestions() {
  // Get URL params for filtering
  const urlParams = new URLSearchParams(window.location.search);
  const topicParam = urlParams.get('topic');
  const companyParam = urlParams.get('company');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>(topicParam || "all");
  const [companyFilter, setCompanyFilter] = useState<string>(companyParam || "all");
  
  const { data: problems = [], isLoading } = useQuery<DsaProblem[]>({ 
    queryKey: ['/api/dsa-problems'] 
  });
  
  const { data: topics = [] } = useQuery<any[]>({ 
    queryKey: ['/api/dsa-topics'] 
  });
  
  const { data: companies = [] } = useQuery<any[]>({ 
    queryKey: ['/api/dsa-companies'] 
  });

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'all' || problem.topicIds?.includes(parseInt(topicFilter));
    const matchesCompany = companyFilter === 'all' || problem.companyIds?.includes(parseInt(companyFilter));
    return matchesSearch && matchesDifficulty && matchesTopic && matchesCompany;
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
    <div className="min-h-screen bg-background">
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            <Link href="/dsa-corner">
              <Button variant="ghost" className="whitespace-nowrap">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dsa-corner/questions">
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap">
                <Code className="h-4 w-4 mr-2" />
                Questions
              </Button>
            </Link>
            <Link href="/dsa-corner/topics">
              <Button variant="ghost" className="whitespace-nowrap">
                <BookOpen className="h-4 w-4 mr-2" />
                Topics
              </Button>
            </Link>
            <Link href="/dsa-corner/companies">
              <Button variant="ghost" className="whitespace-nowrap">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Button>
            </Link>
            <Link href="/dsa-corner/sheets">
              <Button variant="ghost" className="whitespace-nowrap">
                <FileText className="h-4 w-4 mr-2" />
                Sheets
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Data Structures & Algorithms</h1>
          <p className="text-xl text-orange-100 mb-8">
            Practice {problems.length.toLocaleString()}+ coding problems from top companies. Master DSA concepts and ace your interviews.
          </p>

          {/* Stats */}
          <div className="flex gap-6 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">{problems.length.toLocaleString()}</div>
              <div className="text-sm text-orange-100">Problems</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">{easyCount}</div>
              <div className="text-sm text-orange-100">Easy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">{mediumCount}</div>
              <div className="text-sm text-orange-100">Medium</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">{hardCount}</div>
              <div className="text-sm text-orange-100">Hard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Tabs */}
        <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter} className="mb-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">
              All <Badge variant="secondary" className="ml-2">{problems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="easy">
              Easy <Badge variant="secondary" className="ml-2">{easyCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="medium">
              Medium <Badge variant="secondary" className="ml-2">{mediumCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="hard">
              Hard <Badge variant="secondary" className="ml-2">{hardCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Problems Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Video</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Leetcode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Solve</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Companies</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase">Topics</th>
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
                      <tr key={problem.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4">
                          {problem.status === 'solved' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Link href={`/dsa-corner/questions/${problem.id}`}>
                            <a className="font-medium hover:text-orange-600 transition-colors">
                              {index + 1}. {problem.title}
                            </a>
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          {problem.videoUrl && (
                            <a href={problem.videoUrl} target="_blank" rel="noopener noreferrer">
                              <Youtube className="h-5 w-5 text-red-600 hover:text-red-700" />
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {problem.leetcodeUrl && (
                            <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer">
                              <CodeIcon className="h-5 w-5 text-orange-600 hover:text-orange-700" />
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Link href={`/dsa-corner/questions/${problem.id}`}>
                            <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                              Solve
                            </Button>
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {problem.companies?.slice(0, 2).map((company, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
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
                              <Badge key={i} variant="secondary" className="text-xs">
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
