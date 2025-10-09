
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Download, Eye, ExternalLink } from "lucide-react";

export default function PortfolioShared() {
  const { shareId } = useParams();

  const { data: sharedPortfolio, isLoading, error } = useQuery({
    queryKey: [`/api/portfolio/shared/${shareId}`],
    enabled: !!shareId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !sharedPortfolio) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-semibold mb-2">Portfolio Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This shared portfolio link may have expired or been removed.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    const blob = new Blob([sharedPortfolio.code.html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${sharedPortfolio.portfolioData.name}-portfolio.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${sharedPortfolio.portfolioData.name}'s Portfolio`,
          text: `Check out ${sharedPortfolio.portfolioData.name}'s amazing portfolio!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">
                {sharedPortfolio.portfolioData.name}'s Portfolio
              </h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {sharedPortfolio.template?.name || 'Custom Template'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Full View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="flex-1">
        {sharedPortfolio.code?.html ? (
          <iframe
            srcDoc={sharedPortfolio.code.html}
            className="w-full min-h-screen border-0"
            title={`${sharedPortfolio.portfolioData.name}'s Portfolio`}
            style={{ height: 'calc(100vh - 64px)' }}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Portfolio Loading</h3>
              <p className="text-muted-foreground">
                The portfolio template is being rendered...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Created with Talentd Portfolio Builder</span>
              {sharedPortfolio.template && (
                <span>Template: {sharedPortfolio.template.name}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>Shared: {new Date(sharedPortfolio.createdAt).toLocaleDateString()}</span>
              <Badge variant="outline" className="text-xs">
                Live Portfolio
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
