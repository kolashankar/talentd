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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              <Button variant="ghost" className="whitespace-nowrap">
                <Code className="h-4 w-4 mr-2" />
                Questions
              </Button>
            </Link>
            <Link href="/dsa-corner/topics">
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Topics & Tags</h1>
          <p className="text-xl text-orange-100">
            Browse {topics.length} topics and practice problems by category
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="border-2">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{topics.length}</div>
              <div className="text-sm text-muted-foreground">Topics</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{beginnerCount}</div>
              <div className="text-sm text-muted-foreground">Beginner</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{intermediateCount}</div>
              <div className="text-sm text-muted-foreground">Intermediate</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{advancedCount}</div>
              <div className="text-sm text-muted-foreground">Advanced</div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Browse by Difficulty</h3>
            <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <TabsList>
                <TabsTrigger value="all">
                  All Topics <Badge variant="secondary" className="ml-2">{topics.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="beginner">
                  Beginner <Badge variant="secondary" className="ml-2">{beginnerCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="intermediate">
                  Intermediate <Badge variant="secondary" className="ml-2">{intermediateCount}</Badge>
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  Advanced <Badge variant="secondary" className="ml-2">{advancedCount}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <div>
          <h3 className="text-xl font-bold mb-4">All Topics ({filteredTopics.length})</h3>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading topics...</div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No topics found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((topic) => (
                <Link key={topic.id} href={`/dsa-corner/questions?topic=${topic.id}`}>
                  <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{topic.name}</h4>
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty}
                          </Badge>
                        </div>
                        <BookOpen className="h-6 w-6 text-orange-600" />
                      </div>
                      {topic.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
                      )}
                      <div className="flex items-center text-sm text-orange-600">
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