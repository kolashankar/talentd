import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  SlidersHorizontal, 
  Code,
  Clock,
  Target,
  X,
  Star,
  Users,
  ArrowRight,
  Trophy,
  Brain
} from "lucide-react";
import { FAQSection, dsaFAQs } from "@/components/faq-section";

interface DsaProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  successRate?: number;
  totalSubmissions?: number;
  companies?: string[];
  createdAt: string;
}

export default function DSACorner() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("difficulty");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: problems = [], isLoading } = useQuery<DsaProblem[]>({
    queryKey: ['/api/dsa-problems'],
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(problems.map(problem => problem.category).filter(Boolean)));
    const tags = Array.from(new Set(problems.flatMap(problem => problem.tags || [])));
    const companies = Array.from(new Set(problems.flatMap(problem => problem.companies || [])));
    const difficulties = ['easy', 'medium', 'hard'];

    return { categories, tags, companies, difficulties };
  }, [problems]);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = !searchTerm || 
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !categoryFilter || categoryFilter === "all" || problem.category === categoryFilter;
      const matchesDifficulty = !difficultyFilter || difficultyFilter === "all" || problem.difficulty === difficultyFilter;
      const matchesCompany = !companyFilter || companyFilter === "all" || problem.companies?.includes(companyFilter);
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => problem.tags?.includes(tag));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesCompany && matchesTags;
    });

    // Sort problems
    switch (sortBy) {
      case "difficulty":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "popular":
        return filtered.sort((a, b) => (b.totalSubmissions || 0) - (a.totalSubmissions || 0));
      case "success-rate":
        return filtered.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [problems, searchTerm, categoryFilter, difficultyFilter, companyFilter, selectedTags, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setDifficultyFilter("");
    setCompanyFilter("");
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-accent/20 text-accent rounded-lg flex items-center justify-center">
                <Code className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
              DSA Corner
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Master Data Structures & Algorithms with curated problems
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search problems by title, category, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-12 h-12 text-lg"
                  data-testid="search-input"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-2"
                  data-testid="filter-toggle"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6" data-testid="filters-sidebar">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="clear-filters">
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger data-testid="category-filter">
                        <SelectValue placeholder="Any category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any category</SelectItem>
                        {filterOptions.categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty</label>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger data-testid="difficulty-filter">
                        <SelectValue placeholder="Any difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any difficulty</SelectItem>
                        {filterOptions.difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Companies</label>
                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger data-testid="company-filter">
                        <SelectValue placeholder="Any company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any company</SelectItem>
                        {filterOptions.companies.map(company => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filterOptions.tags.slice(0, 20).map(tag => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => toggleTag(tag)}
                            data-testid={`tag-${tag}`}
                          />
                          <label htmlFor={tag} className="text-sm">{tag}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Problems List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold" data-testid="results-count">
                  {filteredProblems.length} Problems Found
                </h2>
                {(searchTerm || categoryFilter || difficultyFilter || companyFilter || selectedTags.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchTerm && (
                      <Badge variant="secondary">
                        Search: {searchTerm}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchTerm("")} />
                      </Badge>
                    )}
                    {categoryFilter && (
                      <Badge variant="secondary">
                        Category: {categoryFilter}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setCategoryFilter("")} />
                      </Badge>
                    )}
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48" data-testid="sort-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="difficulty">By Difficulty</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="success-rate">Success Rate</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-6 bg-muted rounded w-16"></div>
                          <div className="h-4 bg-muted rounded w-12"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProblems.length === 0 ? (
              /* No Results */
              <div className="text-center py-16">
                <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No problems found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or clearing filters
                </p>
                <Button onClick={clearFilters} data-testid="clear-filters-empty">
                  Clear all filters
                </Button>
              </div>
            ) : (
              /* Problems List */
              <div className="space-y-4" data-testid="problems-list">
                {filteredProblems.map((problem, index) => (
                  <Card 
                    key={problem.id} 
                    className="hover:shadow-lg transition-all cursor-pointer"
                    data-testid={`problem-card-${problem.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {/* Title and Difficulty */}
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold" data-testid={`problem-title-${problem.id}`}>
                              {problem.title}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className={getDifficultyColor(problem.difficulty)}
                              data-testid={`problem-difficulty-${problem.id}`}
                            >
                              {problem.difficulty}
                            </Badge>
                            <Badge variant="outline" data-testid={`problem-category-${problem.id}`}>
                              {problem.category}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`problem-description-${problem.id}`}>
                            {problem.description}
                          </p>

                          {/* Tags */}
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {problem.tags.slice(0, 5).map((tag, tagIndex) => (
                                <Badge 
                                  key={tagIndex} 
                                  variant="outline" 
                                  className="text-xs"
                                  data-testid={`problem-tag-${problem.id}-${tagIndex}`}
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {problem.tags.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{problem.tags.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Companies */}
                          {problem.companies && problem.companies.length > 0 && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Trophy className="h-4 w-4" />
                              <span>Asked by: {problem.companies.slice(0, 3).join(', ')}</span>
                              {problem.companies.length > 3 && (
                                <span>+{problem.companies.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Stats and Action */}
                        <div className="text-right space-y-2">
                          {problem.successRate && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Success Rate:</span>
                              <span className="ml-1 font-medium text-green-600" data-testid={`problem-success-rate-${problem.id}`}>
                                {problem.successRate}%
                              </span>
                            </div>
                          )}
                          {problem.totalSubmissions && (
                            <div className="text-sm text-muted-foreground" data-testid={`problem-submissions-${problem.id}`}>
                              {problem.totalSubmissions} submissions
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary hover:text-primary/80 font-medium"
                              onClick={() => window.location.href = `/dsa/${problem.id}`}
                              data-testid={`problem-solve-${problem.id}`}
                            >
                              Solve
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Complexity Info */}
                      {(problem.timeComplexity || problem.spaceComplexity) && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            {problem.timeComplexity && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>Time: {problem.timeComplexity}</span>
                              </div>
                            )}
                            {problem.spaceComplexity && (
                              <div className="flex items-center space-x-1">
                                <Target className="h-4 w-4" />
                                <span>Space: {problem.spaceComplexity}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12">
        <FAQSection faqs={dsaFAQs} />
      </div>
    </div>
  );
}