import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  LayoutDashboard,
  Code,
  BookOpen,
  Building2,
  FileText,
  TrendingUp
} from "lucide-react";

interface DsaTopic {
  id: number;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  problemCount?: number;
  isPublished: boolean;
}

export default function DsaTopics() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const { data: topics = [], isLoading } = useQuery<DsaTopic[]>({ 
    queryKey: ['/api/dsa-topics'] 
  });

  const filteredTopics = topics.filter(topic => 
    difficultyFilter === 'all' || topic.difficulty === difficultyFilter
  );

  const totalProblems = topics.reduce((sum, topic) => sum + (topic.problemCount || 0), 0);
  const beginnerCount = topics.filter(t => t.difficulty === 'beginner').length;
  const intermediateCount = topics.filter(t => t.difficulty === 'intermediate').length;
  const advancedCount = topics.filter(t => t.difficulty === 'advanced').length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="dsa-topics-page">
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
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-questions">
              <Link href="/dsa-corner/questions">
                <Code className="h-4 w-4 mr-2" />
                Questions
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap" 
              asChild
              data-testid="button-nav-topics"
            >
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">Topics & Tags</h1>
          <p className="text-xl text-blue-50" data-testid="text-page-subtitle">
            Browse {topics.length} topics and practice problems by category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-stat-topics">{topics.length}</div>
              <div className="text-sm text-muted-foreground mt-2">Topics</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-stat-problems">{totalProblems}</div>
              <div className="text-sm text-muted-foreground mt-2">Problems</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600" data-testid="text-stat-beginner">{beginnerCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Beginner</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-red-600" data-testid="text-stat-advanced">{advancedCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Advanced</div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Browse by Difficulty</h3>
              <p className="text-sm text-muted-foreground">{topics.length} topics across 3 difficulty levels</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={difficultyFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('all')}
                className={difficultyFilter === 'all' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                data-testid="button-filter-all"
              >
                All Topics <Badge variant="secondary" className="ml-2">{topics.length}</Badge>
              </Button>
              <Button
                variant={difficultyFilter === 'beginner' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('beginner')}
                className={difficultyFilter === 'beginner' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                data-testid="button-filter-beginner"
              >
                Beginner <Badge variant="secondary" className="ml-2">{beginnerCount}</Badge>
              </Button>
              <Button
                variant={difficultyFilter === 'intermediate' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('intermediate')}
                className={difficultyFilter === 'intermediate' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                data-testid="button-filter-intermediate"
              >
                Intermediate <Badge variant="secondary" className="ml-2">{intermediateCount}</Badge>
              </Button>
              <Button
                variant={difficultyFilter === 'advanced' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('advanced')}
                className={difficultyFilter === 'advanced' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                data-testid="button-filter-advanced"
              >
                Advanced <Badge variant="secondary" className="ml-2">{advancedCount}</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <div>
          <h3 className="text-2xl font-bold mb-6">All Topics ({filteredTopics.length})</h3>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading topics...</div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No topics found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((topic) => (
                <Link key={topic.id} href={`/dsa-corner/topics/${topic.id}`}>
                  <Card 
                    className="hover-elevate active-elevate-2 transition-all cursor-pointer" 
                    data-testid={`card-topic-${topic.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2" data-testid={`text-topic-name-${topic.id}`}>{topic.name}</h4>
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      {topic.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
                      )}
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {topic.problemCount || 0} problems
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
