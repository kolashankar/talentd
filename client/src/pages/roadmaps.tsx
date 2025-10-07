
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
  Map,
  Clock,
  BookOpen,
  X,
  Star,
  Users,
  ArrowRight,
  Target
} from "lucide-react";
import { FAQSection, roadmapsFAQs } from "@/components/faq-section";

interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  skills: string[];
  rating: number;
  enrolledCount: number;
  createdAt: string;
  thumbnail?: string;
}

export default function Roadmaps() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [educationLevelFilter, setEducationLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: roadmaps = [], isLoading } = useQuery<Roadmap[]>({
    queryKey: ['/api/roadmaps'],
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(roadmaps.map(roadmap => roadmap.category).filter(Boolean)));
    const skills = Array.from(new Set(roadmaps.flatMap(roadmap => roadmap.skills || [])));
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const durations = ['1-2 weeks', '1 month', '2-3 months', '3+ months'];
    
    return { categories, skills, difficulties, durations };
  }, [roadmaps]);

  // Filter and sort roadmaps
  const filteredRoadmaps = useMemo(() => {
    let filtered = roadmaps.filter(roadmap => {
      const matchesSearch = !searchTerm || 
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !categoryFilter || categoryFilter === "all" || roadmap.category === categoryFilter;
      const matchesDifficulty = !difficultyFilter || difficultyFilter === "all" || roadmap.difficulty === difficultyFilter;
      const matchesEducationLevel = !educationLevelFilter || educationLevelFilter === "all" || (roadmap as any).educationLevel === educationLevelFilter;
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.some(skill => roadmap.skills?.includes(skill));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEducationLevel && matchesSkills;
    });

    // Sort roadmaps
    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
      case "rating":
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [roadmaps, searchTerm, categoryFilter, difficultyFilter, selectedSkills, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setDifficultyFilter("");
    setDurationFilter("");
    setSelectedSkills([]);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                <Map className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
              Learning Roadmaps
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Structured learning paths to master in-demand tech skills
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search roadmaps by title, category, or skills..."
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

                  {/* Education Level Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Education Level</label>
                    <Select value={educationLevelFilter} onValueChange={setEducationLevelFilter}>
                      <SelectTrigger data-testid="education-level-filter">
                        <SelectValue placeholder="Any level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any level</SelectItem>
                        <SelectItem value="upto-10th">Upto 10th Class</SelectItem>
                        <SelectItem value="12th">12th Pass/Pursuing</SelectItem>
                        <SelectItem value="btech">B.Tech/Engineering</SelectItem>
                        <SelectItem value="degree">Degree/Graduation</SelectItem>
                        <SelectItem value="postgrad">Post Graduation</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                      <SelectTrigger data-testid="duration-filter">
                        <SelectValue placeholder="Any duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any duration</SelectItem>
                        {filterOptions.durations.map(duration => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skills</label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filterOptions.skills.slice(0, 20).map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => toggleSkill(skill)}
                            data-testid={`skill-${skill}`}
                          />
                          <label htmlFor={skill} className="text-sm">{skill}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Roadmaps List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold" data-testid="results-count">
                  {filteredRoadmaps.length} Roadmaps Found
                </h2>
                {(searchTerm || categoryFilter || difficultyFilter || selectedSkills.length > 0) && (
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
                    {selectedSkills.map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleSkill(skill)} />
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
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-32 bg-muted rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRoadmaps.length === 0 ? (
              /* No Results */
              <div className="text-center py-16">
                <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No roadmaps found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or clearing filters
                </p>
                <Button onClick={clearFilters} data-testid="clear-filters-empty">
                  Clear all filters
                </Button>
              </div>
            ) : (
              /* Roadmaps Grid */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="roadmaps-grid">
                {filteredRoadmaps.map((roadmap, index) => (
                  <Card 
                    key={roadmap.id} 
                    className="hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
                    data-testid={`roadmap-card-${roadmap.id}`}
                  >
                    <CardContent className="p-6">
                      {/* Thumbnail */}
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                        <Target className="h-8 w-8 text-primary" />
                      </div>

                      {/* Title and Category */}
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`roadmap-title-${roadmap.id}`}>
                          {roadmap.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" data-testid={`roadmap-category-${roadmap.id}`}>
                            {roadmap.category}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={getDifficultyColor(roadmap.difficulty)}
                            data-testid={`roadmap-difficulty-${roadmap.id}`}
                          >
                            {roadmap.difficulty}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`roadmap-description-${roadmap.id}`}>
                        {roadmap.description}
                      </p>

                      {/* Skills */}
                      {roadmap.skills && roadmap.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {roadmap.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Badge 
                                key={skillIndex} 
                                variant="outline" 
                                className="text-xs"
                                data-testid={`roadmap-skill-${roadmap.id}-${skillIndex}`}
                              >
                                {skill}
                              </Badge>
                            ))}
                            {roadmap.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{roadmap.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span data-testid={`roadmap-duration-${roadmap.id}`}>
                            {roadmap.duration}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span data-testid={`roadmap-enrolled-${roadmap.id}`}>
                            {roadmap.enrolledCount || 0} enrolled
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < (roadmap.rating || 0) ? 'fill-current' : ''}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground" data-testid={`roadmap-rating-${roadmap.id}`}>
                            {roadmap.rating || 0}
                          </span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80 font-medium"
                          onClick={() => window.location.href = `/roadmaps/${roadmap.id}`}
                          data-testid={`roadmap-start-${roadmap.id}`}
                        >
                          Start Learning
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
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
        <FAQSection faqs={roadmapsFAQs} />
      </div>
    </div>
  );
}
