
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioBuilder } from "@/components/portfolio/portfolio-builder";
import { 
  Plus, 
  User, 
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Download,
  Globe,
  Lock
} from "lucide-react";

interface Portfolio {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  profileImage?: string;
  resumeUrl?: string;
  projects: any[];
  skills: string[];
  experience: any[];
  education: any[];
  isPublic: boolean;
  theme: string;
  createdAt: string;
}

export default function PortfolioPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  const { data: portfolios = [], refetch } = useQuery<Portfolio[]>({
    queryKey: ['/api/portfolios'],
  });

  if (showBuilder) {
    return (
      <PortfolioBuilder
        portfolio={editingPortfolio}
        onSave={() => {
          setShowBuilder(false);
          setEditingPortfolio(null);
          refetch();
        }}
        onCancel={() => {
          setShowBuilder(false);
          setEditingPortfolio(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold">My Portfolios</h1>
              <p className="text-sm text-muted-foreground">Create and manage your professional portfolios</p>
            </div>
            <Button onClick={() => setShowBuilder(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Portfolio
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {portfolios.length === 0 ? (
          <div className="text-center py-16">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No portfolios yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first portfolio to showcase your skills and experience
            </p>
            <Button onClick={() => setShowBuilder(true)} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Portfolio
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {portfolio.profileImage ? (
                        <img 
                          src={portfolio.profileImage} 
                          alt={portfolio.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{portfolio.title}</p>
                      </div>
                    </div>
                    <Badge variant={portfolio.isPublic ? "default" : "secondary"}>
                      {portfolio.isPublic ? (
                        <>
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {portfolio.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {portfolio.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {portfolio.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{portfolio.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/portfolio/${portfolio.id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingPortfolio(portfolio);
                          setShowBuilder(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(portfolio.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
