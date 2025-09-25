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
  BookOpen,
  Clock,
  Eye,
  X,
  Calendar,
  User,
  ArrowRight,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import { useLocation } from 'wouter';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  thumbnail?: string;
}

export default function Articles() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(articles.map(article => article.category).filter(Boolean))];
    const tags = [...new Set(articles.flatMap(article => article.tags || []))];
    const authors = [...new Set(articles.map(article => article.author).filter(Boolean))];

    return { categories, tags, authors };
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = articles.filter(article => {
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !categoryFilter || article.category === categoryFilter;
      const matchesAuthor = !authorFilter || article.author === authorFilter;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => article.tags?.includes(tag));

      return matchesSearch && matchesCategory && matchesAuthor && matchesTags;
    });

    // Sort articles
    switch (sortBy) {
      case "newest":
        return filtered.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
      case "oldest":
        return filtered.sort((a, b) => new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime());
      case "popular":
        return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      case "liked":
        return filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [articles, searchTerm, categoryFilter, authorFilter, selectedTags, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setAuthorFilter("");
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary/20 to-accent/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
              Tech Articles
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stay updated with the latest trends, tutorials, and insights in tech
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles by title, content, or tags..."
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
                        <SelectItem value="">Any category</SelectItem>
                        {filterOptions.categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Author</label>
                    <Select value={authorFilter} onValueChange={setAuthorFilter}>
                      <SelectTrigger data-testid="author-filter">
                        <SelectValue placeholder="Any author" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any author</SelectItem>
                        {filterOptions.authors.map(author => (
                          <SelectItem key={author} value={author}>{author}</SelectItem>
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

          {/* Articles List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold" data-testid="results-count">
                  {filteredArticles.length} Articles Found
                </h2>
                {(searchTerm || categoryFilter || authorFilter || selectedTags.length > 0) && (
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
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Viewed</SelectItem>
                    <SelectItem value="liked">Most Liked</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
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
            ) : filteredArticles.length === 0 ? (
              /* No Results */
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or clearing filters
                </p>
                <Button onClick={clearFilters} data-testid="clear-filters-empty">
                  Clear all filters
                </Button>
              </div>
            ) : (
              /* Articles Grid */
              <div className="grid md:grid-cols-2 gap-6" data-testid="articles-grid">
                {filteredArticles.map((article, index) => (
                  <Card 
                    key={article.id} 
                    className="hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
                    data-testid={`article-card-${article.id}`}
                  >
                    <CardContent className="p-6">
                      {/* Thumbnail */}
                      <div className="h-32 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                        {article.featured && (
                          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                            Featured
                          </Badge>
                        )}
                        <BookOpen className="h-8 w-8 text-secondary" />
                      </div>

                      {/* Category and Tags */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" data-testid={`article-category-${article.id}`}>
                          {article.category}
                        </Badge>
                        {article.tags && article.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="text-xs"
                            data-testid={`article-tag-${article.id}-${tagIndex}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`article-title-${article.id}`}>
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`article-excerpt-${article.id}`}>
                        {article.excerpt}
                      </p>

                      {/* Author and Date */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span data-testid={`article-author-${article.id}`}>
                            {article.author}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span data-testid={`article-date-${article.id}`}>
                            {formatDate(article.publishedAt || article.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span data-testid={`article-read-time-${article.id}`}>
                              {article.readTime} min read
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span data-testid={`article-views-${article.id}`}>
                              {article.views || 0}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span data-testid={`article-likes-${article.id}`}>
                              {article.likes || 0}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span data-testid={`article-comments-${article.id}`}>
                              {article.comments || 0}
                            </span>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation(`/articles/${article.id}`)}
                          data-testid={`button-read-more-${article.id}`}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Read More
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
    </div>
  );
}