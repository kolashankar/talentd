import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, User, TrendingUp, Users, LayoutDashboard, Code, BookOpen, Building2, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Import Input component
import { useState } from 'react'; // Import useState hook

interface DsaSheet {
  id: number;
  name: string;
  description?: string;
  creator: string;
  type: "official" | "community" | "public";
  problemCount?: number;
  followerCount?: number;
  isPublished: boolean;
}

// Define an interface for problems to properly type them
interface DsaProblem {
  id: number;
  sheetIds?: number[];
  difficulty?: 'easy' | 'medium' | 'hard';
  // other problem properties
}

export default function DsaSheets() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: sheets = [], isLoading } = useQuery<DsaSheet[]>({
    queryKey: ["/api/dsa-sheets"],
  });

  // Fetch all problems to calculate difficulty counts per sheet
  const { data: allProblems = [] } = useQuery<DsaProblem[]>({
    queryKey: ['/api/dsa/problems'],
  });

  // Calculate difficulty counts for each sheet
  const sheetsWithStats = sheets.map((sheet: DsaSheet) => {
    const sheetProblems = allProblems.filter((p: DsaProblem) => 
      p.sheetIds?.includes(sheet.id)
    );

    return {
      ...sheet,
      easyCount: sheetProblems.filter((p: DsaProblem) => p.difficulty === 'easy').length,
      mediumCount: sheetProblems.filter((p: DsaProblem) => p.difficulty === 'medium').length,
      hardCount: sheetProblems.filter((p: DsaProblem) => p.difficulty === 'hard').length,
    };
  });

  // Filter sheets based on difficulty, type, and search query
  const filteredSheets = sheetsWithStats.filter((sheet: any) => {
    const matchesSearch = sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || 
      (difficultyFilter === 'easy' && sheet.easyCount > 0) ||
      (difficultyFilter === 'medium' && sheet.mediumCount > 0) ||
      (difficultyFilter === 'hard' && sheet.hardCount > 0);
    const matchesType = typeFilter === 'all' || sheet.type === typeFilter;

    return matchesSearch && matchesDifficulty && matchesType;
  });


  const officialSheets = sheets.filter((s) => s.type === "official");
  const communitySheets = sheets.filter(
    (s) => s.type === "community" || s.type === "public",
  );

  // The `getTypeColor` function is not directly used in this component,
  // but it might be intended for future use or for other parts of the application.
  // It defines color classes for different sheet types.
  const getTypeColor = (type: string) => {
    switch (type) {
      case "official":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      case "community":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
      case "public":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            <Button variant="ghost" className="whitespace-nowrap" asChild>
              <Link href="/dsa-corner/companies">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Link>
            </Button>
            <Button
              variant="default"
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap"
              asChild
            >
              <Link href="/dsa-corner/sheets">
                <FileText className="h-4 w-4 mr-2" />
                Sheets
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Study Sheets</h1>
          <p className="text-xl text-blue-100">
            Curated problem sets and study guides from 0+ sources
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{sheets.length}</div>
                <div className="text-sm text-muted-foreground">Total Sheets</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{officialSheets.length}</div>
                <div className="text-sm text-muted-foreground">Official</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{communitySheets.length}</div>
                <div className="text-sm text-muted-foreground">Community</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Official Sheets */}
      {officialSheets.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">
            Official Sheets ({officialSheets.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {officialSheets.map((sheet) => (
              <Link key={sheet.id} href={`/dsa-corner/sheets/${sheet.id}`}>
                <Card className="border-2 border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600 transition-all cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-100">
                          {sheet.name}
                        </h4>
                        <Badge className={getTypeColor(sheet.type)}>
                          {sheet.type}
                        </Badge>
                      </div>
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    {sheet.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {sheet.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-blue-600">
                        <User className="h-4 w-4 mr-1" />
                        {sheet.creator}
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {sheet.problemCount || 0} problems
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {sheet.followerCount || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Community Sheets */}
      {communitySheets.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">
            Community Sheets ({communitySheets.length})
          </h3>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading sheets...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communitySheets.map((sheet) => (
                <Link key={sheet.id} href={`/dsa-corner/sheets/${sheet.id}`}>
                  <Card className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600 transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-purple-900 dark:text-purple-100">
                            {sheet.name}
                          </h4>
                          <Badge className={getTypeColor(sheet.type)}>
                            {sheet.type}
                          </Badge>
                        </div>
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      {sheet.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {sheet.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-purple-600">
                          <User className="h-4 w-4 mr-1" />
                          {sheet.creator}
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {sheet.problemCount || 0} problems
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {sheet.followerCount || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {!isLoading && sheets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No sheets found
        </div>
      )}

      {/* Sheets List with Filtering */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Practice Sheets</h2>
          <p className="text-muted-foreground">
            Curated problem sets to master DSA concepts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Difficulty</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={difficultyFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setDifficultyFilter('all')}
                  size="sm"
                  className={difficultyFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant={difficultyFilter === 'easy' ? 'default' : 'outline'}
                  onClick={() => setDifficultyFilter('easy')}
                  size="sm"
                  className={difficultyFilter === 'easy' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Easy
                </Button>
                <Button
                  variant={difficultyFilter === 'medium' ? 'default' : 'outline'}
                  onClick={() => setDifficultyFilter('medium')}
                  size="sm"
                  className={difficultyFilter === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                >
                  Medium
                </Button>
                <Button
                  variant={difficultyFilter === 'hard' ? 'default' : 'outline'}
                  onClick={() => setDifficultyFilter('hard')}
                  size="sm"
                  className={difficultyFilter === 'hard' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Hard
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Type</p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={typeFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setTypeFilter('all')}
                  size="sm"
                  className={typeFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant={typeFilter === 'official' ? 'default' : 'outline'}
                  onClick={() => setTypeFilter('official')}
                  size="sm"
                  className={typeFilter === 'official' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Official
                </Button>
                <Button
                  variant={typeFilter === 'public' ? 'default' : 'outline'}
                  onClick={() => setTypeFilter('public')}
                  size="sm"
                  className={typeFilter === 'public' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                >
                  Public
                </Button>
                <Button
                  variant={typeFilter === 'community' ? 'default' : 'outline'}
                  onClick={() => setTypeFilter('community')}
                  size="sm"
                  className={typeFilter === 'community' ? 'bg-pink-600 hover:bg-pink-700' : ''}
                >
                  Community
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredSheets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || difficultyFilter !== 'all' || typeFilter !== 'all'
                  ? 'No sheets match your filters. Try adjusting your search.'
                  : 'Check back later for curated problem sheets'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSheets.map((sheet: any) => (
              <Link key={sheet.id} href={`/dsa-corner/sheets/${sheet.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 truncate">
                          {sheet.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {sheet.creator}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {sheet.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {sheet.problemCount || 0} problems
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        {sheet.easyCount > 0 && (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {sheet.easyCount} Easy
                          </span>
                        )}
                        {sheet.mediumCount > 0 && (
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                            {sheet.mediumCount} Medium
                          </span>
                        )}
                        {sheet.hardCount > 0 && (
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {sheet.hardCount} Hard
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View Sheet <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}