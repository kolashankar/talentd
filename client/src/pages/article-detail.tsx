
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  ThumbsUp, 
  MessageCircle,
  Share2,
  BookOpen,
  Tag
} from "lucide-react";

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
  featuredImage?: string;
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Basic markdown-like formatting
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Handle headers
        if (paragraph.startsWith('# ')) {
          return `<h1 key=${index} class="text-3xl font-bold mb-4 mt-8">${paragraph.slice(2)}</h1>`;
        }
        if (paragraph.startsWith('## ')) {
          return `<h2 key=${index} class="text-2xl font-semibold mb-3 mt-6">${paragraph.slice(3)}</h2>`;
        }
        if (paragraph.startsWith('### ')) {
          return `<h3 key=${index} class="text-xl font-medium mb-2 mt-4">${paragraph.slice(4)}</h3>`;
        }
        
        // Handle code blocks
        if (paragraph.startsWith('```')) {
          const codeContent = paragraph.slice(3, -3);
          return `<pre key=${index} class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>${codeContent}</code></pre>`;
        }
        
        // Handle lists
        if (paragraph.includes('\n- ')) {
          const items = paragraph.split('\n- ').slice(1);
          const listItems = items.map(item => `<li class="mb-1">${item}</li>`).join('');
          return `<ul key=${index} class="list-disc list-inside my-4 space-y-1">${listItems}</ul>`;
        }
        
        // Regular paragraph
        return `<p key=${index} class="mb-4 text-muted-foreground leading-relaxed">${paragraph}</p>`;
      })
      .join('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Article not found</h2>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/articles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
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
          onClick={() => setLocation('/articles')}
          data-testid="back-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>

        {/* Article Header */}
        <Card className="mb-8">
          <CardHeader className="pb-6">
            {/* Featured Image */}
            {article.featuredImage ? (
              <div className="w-full h-64 mb-6">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg mb-6 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-secondary" />
              </div>
            )}

            {/* Category and Featured Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" data-testid="article-category">
                {article.category}
              </Badge>
              {article.featured && (
                <Badge className="bg-accent text-accent-foreground">
                  Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4" data-testid="article-title">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span data-testid="article-author">{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span data-testid="article-date">
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span data-testid="article-read-time">{article.readTime} min read</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span data-testid="article-views">{article.views || 0} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span data-testid="article-likes">{article.likes || 0} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span data-testid="article-comments">{article.comments || 0} comments</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
              data-testid="article-content"
            />
          </CardContent>
        </Card>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4" />
                <span className="font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-secondary/80"
                    data-testid={`tag-${index}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button variant="outline" data-testid="like-button">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Like ({article.likes || 0})
                </Button>
                <Button variant="outline" data-testid="comment-button">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Comment
                </Button>
              </div>
              <Button variant="outline" data-testid="share-button">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
