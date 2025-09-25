import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Portfolio } from "@shared/schema";
import { AIPortfolioAssistant } from "@/components/portfolio/ai-portfolio-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollAnimations } from "@/components/animations/scroll-animations";
import { ParallaxHero } from "@/components/animations/parallax-hero";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  User, 
  Briefcase, 
  Download, 
  Eye, 
  Edit,
  Plus,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone
} from "lucide-react";

export default function PortfolioPage() {
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: portfolios = [], isLoading } = useQuery<Portfolio[]>({
    queryKey: ['/api/portfolios'],
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete portfolio');
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Portfolio deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete portfolio",
        variant: "destructive",
      });
    },
  });

  const handleCreateNew = () => {
    setEditingPortfolio(null);
    setShowBuilder(true);
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setShowBuilder(true);
  };

  const handleSave = () => {
    setShowBuilder(false);
    setEditingPortfolio(null);
    queryClient.invalidateQueries({ queryKey: ['/api/portfolios'] });
  };

  if (showBuilder) {
    return (
      <PortfolioBuilder
        portfolio={editingPortfolio}
        onSave={handleSave}
        onCancel={() => setShowBuilder(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ParallaxHero
        backgroundImage="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&h=1560"
        overlay="rgba(15, 23, 42, 0.8)"
        className="h-96"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <ScrollAnimations>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 fade-in-up" data-testid="heading-portfolio">
                Portfolio Builder
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto fade-in-up" style={{"--stagger": "1"} as any}>
                Create stunning portfolios with integrated resume showcase and project highlights
              </p>
              <Button size="lg" onClick={handleCreateNew} className="fade-in-up" style={{"--stagger": "2"} as any} data-testid="button-create-portfolio">
                <Plus className="mr-2 h-5 w-5" />
                Create New Portfolio
              </Button>
            </ScrollAnimations>
          </div>
        </div>
      </ParallaxHero>

      {/* Portfolio Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimations>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up" data-testid="heading-featured-portfolios">
                Featured Portfolios
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up" data-testid="text-portfolio-subtitle">
                Discover inspiring portfolio examples from our community
              </p>
            </div>
          </ScrollAnimations>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-muted rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-16" data-testid="empty-portfolios">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-semibold mb-4">No portfolios yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Be the first to create a stunning portfolio and showcase your work to potential employers.
              </p>
              <Button size="lg" onClick={handleCreateNew} data-testid="button-create-first-portfolio">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Portfolio
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios.map((portfolio, index) => (
                <ScrollAnimations key={portfolio.id}>
                  <Card className="card-hover fade-in-up" style={{"--stagger": index + 1} as any} data-testid={`portfolio-card-${portfolio.id}`}>
                    <CardContent className="p-0">
                      {/* Portfolio Header */}
                      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                        <div className="flex items-center space-x-4">
                          {portfolio.profileImage ? (
                            <img 
                              src={portfolio.profileImage} 
                              alt={portfolio.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                              data-testid={`portfolio-avatar-${portfolio.id}`}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                              <User className="h-8 w-8" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold" data-testid={`portfolio-name-${portfolio.id}`}>
                              {portfolio.name}
                            </h3>
                            <p className="opacity-90" data-testid={`portfolio-title-${portfolio.id}`}>
                              {portfolio.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {portfolio.email && (
                                <Mail className="h-4 w-4" data-testid={`portfolio-email-icon-${portfolio.id}`} />
                              )}
                              {portfolio.linkedin && (
                                <Linkedin className="h-4 w-4" data-testid={`portfolio-linkedin-icon-${portfolio.id}`} />
                              )}
                              {portfolio.github && (
                                <Github className="h-4 w-4" data-testid={`portfolio-github-icon-${portfolio.id}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Portfolio Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`portfolio-bio-${portfolio.id}`}>
                            {portfolio.bio}
                          </p>
                        </div>

                        {/* Skills */}
                        {portfolio.skills && portfolio.skills.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {portfolio.skills.slice(0, 4).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs" data-testid={`portfolio-skill-${portfolio.id}-${skillIndex}`}>
                                  {skill}
                                </Badge>
                              ))}
                              {portfolio.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{portfolio.skills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {portfolio.projects && portfolio.projects.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Featured Projects</h4>
                            <div className="space-y-2">
                              {portfolio.projects.slice(0, 2).map((project, projectIndex) => (
                                <div key={projectIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded" data-testid={`portfolio-project-${portfolio.id}-${projectIndex}`}>
                                  <div>
                                    <div className="font-medium text-sm">{project.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {project.technologies.slice(0, 3).join(', ')}
                                    </div>
                                  </div>
                                  {project.demoUrl && (
                                    <ExternalLink className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resume */}
                        {portfolio.resumeUrl && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Resume</h4>
                              <Button variant="ghost" size="sm" data-testid={`button-download-resume-${portfolio.id}`}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="bg-muted/30 border-2 border-dashed border-muted rounded p-4 text-center">
                              <Download className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">Resume available for download</p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setLocation(`/portfolio/${portfolio.id}`)}
                            data-testid={`button-view-portfolio-${portfolio.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(portfolio)}
                            data-testid={`button-edit-portfolio-${portfolio.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimations>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimations>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up" data-testid="heading-features">
                Portfolio Features
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up" data-testid="text-features-subtitle">
                Everything you need to create a professional portfolio
              </p>
            </div>
          </ScrollAnimations>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: User,
                title: "Personal Branding",
                description: "Showcase your unique professional identity"
              },
              {
                icon: Briefcase,
                title: "Project Gallery",
                description: "Display your best work with detailed descriptions"
              },
              {
                icon: Download,
                title: "Resume Integration",
                description: "Seamlessly integrate your resume for easy access"
              },
              {
                icon: Globe,
                title: "Custom Domain",
                description: "Use your own domain for a professional presence"
              }
            ].map((feature, index) => (
              <ScrollAnimations key={index}>
                <Card className="text-center fade-in-up card-hover" style={{"--stagger": index + 1} as any} data-testid={`feature-card-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" data-testid={`feature-title-${index}`}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm" data-testid={`feature-description-${index}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollAnimations>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}