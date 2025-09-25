import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentForm } from "@/components/admin/content-form";
import { AiGenerator } from "@/components/admin/ai-generator";
import { AdminAgent } from "@/components/admin/admin-agent";
import { useQuery } from "@tanstack/react-query";
import { Job, Article, Roadmap, DsaProblem } from "@shared/schema";
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  Route, 
  FileText, 
  Code,
  Plus,
  Edit,
  Trash2,
  Bot,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  const handleAdminLogin = () => {
    // Simple admin code check - in production, use proper authentication
    if (adminCode === "admin123" || adminCode === "ADMIN2024" || adminCode === "admin" || adminCode === "password") {
      setIsAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin code. Try: admin123, ADMIN2024, admin, or password",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Code</label>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full p-2 border border-border rounded-md"
                placeholder="Enter admin code"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <Button onClick={handleAdminLogin} className="w-full">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conditionally run queries only when authenticated
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    enabled: isAuthenticated,
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    enabled: isAuthenticated,
  });

  const { data: roadmaps = [] } = useQuery<Roadmap[]>({
    queryKey: ['/api/roadmaps'],
    enabled: isAuthenticated,
  });

  const { data: dsaProblems = [] } = useQuery<DsaProblem[]>({
    queryKey: ['/api/dsa-problems'],
    enabled: isAuthenticated,
  });

  const sidebarItems = [
    { id: "jobs", label: "Jobs", icon: Briefcase, count: jobs.length },
    { id: "fresher-jobs", label: "Fresher Jobs", icon: GraduationCap, count: jobs.filter(j => j.category === 'fresher-job').length },
    { id: "internships", label: "Internships", icon: Users, count: jobs.filter(j => j.category === 'internship').length },
    { id: "roadmaps", label: "Roadmaps", icon: Route, count: roadmaps.length },
    { id: "articles", label: "Articles", icon: FileText, count: articles.length },
    { id: "dsa-corner", label: "DSA Corner", icon: Code, count: dsaProblems.length },
  ];

  const stats = [
    { label: "Total Jobs", value: jobs.length, icon: Briefcase, color: "text-blue-600" },
    { label: "Active Articles", value: articles.length, icon: FileText, color: "text-green-600" },
    { label: "Learning Paths", value: roadmaps.length, icon: Route, color: "text-purple-600" },
    { label: "DSA Problems", value: dsaProblems.length, icon: Code, color: "text-orange-600" },
  ];

  const handleDelete = async (type: string, id: string) => {
    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const renderContentList = () => {
    let data: any[] = [];
    let type = "";

    switch (activeTab) {
      case "jobs":
      case "fresher-jobs":
      case "internships":
        data = activeTab === "jobs" ? jobs : jobs.filter(j => j.category === activeTab.replace('-', '_'));
        type = "jobs";
        break;
      case "roadmaps":
        data = roadmaps;
        type = "roadmaps";
        break;
      case "articles":
        data = articles;
        type = "articles";
        break;
      case "dsa-corner":
        data = dsaProblems;
        type = "dsa-problems";
        break;
      default:
        return null;
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-12" data-testid="empty-state">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No content yet</h3>
          <p className="text-muted-foreground mb-6">Create your first {activeTab.replace('-', ' ')} entry</p>
          <Button onClick={() => setSelectedItem({})}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow" data-testid={`content-item-${item.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg" data-testid={`item-title-${item.id}`}>
                      {item.title}
                    </h3>
                    {item.category && (
                      <Badge variant="secondary" data-testid={`item-category-${item.id}`}>
                        {item.category}
                      </Badge>
                    )}
                    {item.difficulty && (
                      <Badge 
                        variant={item.difficulty === 'easy' ? 'default' : item.difficulty === 'medium' ? 'secondary' : 'destructive'}
                        data-testid={`item-difficulty-${item.id}`}
                      >
                        {item.difficulty}
                      </Badge>
                    )}
                  </div>
                  
                  {item.company && (
                    <p className="text-sm text-muted-foreground mb-1" data-testid={`item-company-${item.id}`}>
                      {item.company} • {item.location} • {item.salaryRange}
                    </p>
                  )}
                  
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground mb-1" data-testid={`item-excerpt-${item.id}`}>
                      {item.excerpt}
                    </p>
                  )}
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`item-description-${item.id}`}>
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span data-testid={`item-created-${item.id}`}>
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.isActive !== undefined && (
                      <Badge variant={item.isActive ? "default" : "secondary"} data-testid={`item-status-${item.id}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    )}
                    {item.isPublished !== undefined && (
                      <Badge variant={item.isPublished ? "default" : "secondary"} data-testid={`item-published-${item.id}`}>
                        {item.isPublished ? "Published" : "Draft"}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedItem(item)}
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(type, item.id)}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold" data-testid="admin-title">Admin Dashboard</h1>
              <Badge variant="secondary" data-testid="admin-badge">Content Management</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAiGenerator(!showAiGenerator)}
                data-testid="button-ai-generator"
              >
                <Bot className="mr-2 h-4 w-4" />
                AI Generator
              </Button>
              <Button onClick={() => setSelectedItem({})} data-testid="button-add-content">
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} data-testid={`stat-card-${stat.label.toLowerCase().replace(' ', '-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-muted mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground" data-testid={`stat-label-${stat.label.toLowerCase().replace(' ', '-')}`}>
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(' ', '-')}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6" data-testid="admin-sidebar">
              <CardHeader>
                <CardTitle className="text-lg" data-testid="sidebar-title">Content Types</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors ${
                        activeTab === item.id ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      data-testid={`sidebar-item-${item.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs" data-testid={`sidebar-count-${item.id}`}>
                        {item.count}
                      </Badge>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* AI Generator Panel */}
            {showAiGenerator && (
              <AiGenerator className="mt-6" onContentGenerated={(content) => {
                // Map AI content type to admin tab type
                let targetTab = activeTab;
                if (content.difficulty && (content.timeComplexity || content.spaceComplexity)) {
                  targetTab = 'dsa-corner';
                } else if (content.steps || content.technologies) {
                  targetTab = 'roadmaps';
                } else if (content.content && content.author) {
                  targetTab = 'articles';
                } else if (content.company && content.location) {
                  targetTab = 'jobs';
                }
                
                // Switch to the appropriate tab if needed
                if (targetTab !== activeTab) {
                  setActiveTab(targetTab);
                }
                
                setSelectedItem(content);
                setShowAiGenerator(false);
              }} />
            )}

            {/* Admin Agent Panel */}
            {selectedItem && (
              <AdminAgent 
                className="mt-6"
                selectedContent={selectedItem}
                contentType={activeTab}
                onTemplateGenerated={(template) => {
                  // Handle generated template
                  console.log('Template generated:', template);
                }}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedItem ? (
              <ContentForm
                type={activeTab}
                item={selectedItem}
                onSave={() => {
                  setSelectedItem(null);
                  // Invalidate queries to refresh data
                  queryClient.invalidateQueries();
                }}
                onCancel={() => setSelectedItem(null)}
              />
            ) : (
              <Card data-testid="content-list">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl capitalize" data-testid="content-list-title">
                    {activeTab.replace('-', ' ')} Management
                  </CardTitle>
                  <Button onClick={() => setSelectedItem({})} data-testid="button-add-new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  {renderContentList()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
