import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentForm } from "@/components/admin/content-form";
import { AiGenerator } from "@/components/admin/ai-generator";
import { AdminAgent } from "@/components/admin/admin-agent";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Job, Article, Roadmap, DsaProblem, Scholarship } from "@shared/schema";
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
  TrendingUp,
  Folder,
  Upload,
  FileCode,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [adminCode, setAdminCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAdminLogin = async () => {
    if (!adminCode) {
      toast({
        title: "Error",
        description: "Please enter an admin code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: adminCode }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin();
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin dashboard.",
        });
      } else if (response.status === 429) {
        toast({
          title: "Too Many Attempts",
          description: data.message || "Please try again later",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid admin code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify admin code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setAdminCode("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Admin Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="admin-code" className="text-sm font-medium mb-2 block">Admin Code</Label>
            <Input
              id="admin-code"
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full"
              placeholder="Enter admin code"
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleAdminLogin()}
              disabled={isLoading}
              data-testid="input-admin-code"
            />
          </div>
          <Button 
            onClick={handleAdminLogin} 
            className="w-full" 
            disabled={isLoading}
            data-testid="button-admin-login"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Access Admin Panel'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const { toast } = useToast();

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: roadmaps = [] } = useQuery<Roadmap[]>({
    queryKey: ["/api/roadmaps"],
  });

  const { data: dsaProblems = [] } = useQuery<DsaProblem[]>({
    queryKey: ["/api/dsa-problems"],
  });

  const { data: scholarships = [] } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships"],
  });

  const { data: portfolios = [] } = useQuery({
    queryKey: ["/api/portfolios"],
  });

  const { data: templatesData } = useQuery<{ database: any[]; registry: any }>({
    queryKey: ["/api/admin/templates"],
    retry: false,
  });

  const templates = templatesData?.database || [];

  const sidebarItems = [
    { id: "jobs", label: "Jobs", icon: Briefcase, count: jobs.length },
    {
      id: "fresher-jobs",
      label: "Fresher Jobs",
      icon: GraduationCap,
      count: jobs.filter((j) => j.category === "fresher-job").length,
    },
    {
      id: "internships",
      label: "Internships",
      icon: Users,
      count: jobs.filter((j) => j.category === "internship").length,
    },
    { id: "roadmaps", label: "Roadmaps", icon: Route, count: roadmaps.length },
    {
      id: "articles",
      label: "Articles",
      icon: FileText,
      count: articles.length,
    },
    {
      id: "dsa-corner",
      label: "DSA Corner",
      icon: Code,
      count: dsaProblems.length,
    },
    {
      id: "scholarships",
      label: "Scholarships",
      icon: GraduationCap,
      count: scholarships.length,
    },
    {
      id: "portfolio-templates",
      label: "Portfolio Templates",
      icon: FileCode,
      count: templates.length,
    },
  ];

  // Fixed: Convert stats object to array for mapping
  const statsArray = [
    {
      label: "Jobs",
      value: jobs.length,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      label: "Articles",
      value: articles.length,
      icon: FileText,
      color: "text-green-600",
    },
    {
      label: "Roadmaps",
      value: roadmaps.length,
      icon: Route,
      color: "text-purple-600",
    },
    {
      label: "DSA Problems",
      value: dsaProblems.length,
      icon: Code,
      color: "text-orange-600",
    },
    {
      label: "Scholarships",
      value: scholarships.length,
      icon: GraduationCap,
      color: "text-indigo-600",
    },
    {
      label: "Portfolios",
      value: portfolios.length,
      icon: Folder,
      color: "text-pink-600",
    },
  ];

  const uploadTemplateMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('template', file);

      const response = await fetch('/api/admin/templates/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Template uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      setUploadingTemplate(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
      setUploadingTemplate(false);
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete template');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const toggleTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(`/api/admin/templates/${templateId}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to toggle template');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Template status updated',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
    },
  });

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a .zip file',
        variant: 'destructive',
      });
      return;
    }

    setUploadingTemplate(true);
    uploadTemplateMutation.mutate(file);
  };

  const handleDelete = async (type: string, id: string) => {
    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

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
        data =
          activeTab === "jobs"
            ? jobs
            : jobs.filter((j) => j.category === activeTab.replace("-", "_"));
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
      case "scholarships":
        data = scholarships;
        type = "scholarships";
        break;
      case "portfolios":
        data = portfolios;
        type = "portfolios";
        break;
      case "portfolio-templates":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Upload Portfolio Template</span>
                  <FileCode className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-upload">Template Package (.zip)</Label>
                    <div className="mt-2">
                      <Input
                        id="template-upload"
                        type="file"
                        accept=".zip"
                        onChange={handleTemplateUpload}
                        disabled={uploadingTemplate}
                        data-testid="input-template-upload"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload a .zip file containing your portfolio template with manifest.json
                    </p>
                  </div>
                  {uploadingTemplate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading template...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Templates</CardTitle>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
                    <p className="text-muted-foreground">
                      Upload your first portfolio template package
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {templates.map((template: any) => (
                      <Card key={template.templateId} className="hover:shadow-md transition-shadow" data-testid={`template-card-${template.templateId}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg" data-testid={`template-name-${template.templateId}`}>
                                  {template.name}
                                </h3>
                                <Badge variant="outline" data-testid={`template-version-${template.templateId}`}>
                                  v{template.version}
                                </Badge>
                                <Badge variant={template.isActive ? "default" : "secondary"} data-testid={`template-status-${template.templateId}`}>
                                  {template.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {template.isPremium && (
                                  <Badge variant="secondary">Premium</Badge>
                                )}
                              </div>
                              {template.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {template.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline">{template.category}</Badge>
                                {template.features && template.features.slice(0, 3).map((feature: string) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => toggleTemplateMutation.mutate(template.templateId)}
                                title={template.isActive ? "Deactivate" : "Activate"}
                                data-testid={`button-toggle-${template.templateId}`}
                              >
                                {template.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => deleteTemplateMutation.mutate(template.templateId)}
                                title="Delete template"
                                data-testid={`button-delete-${template.templateId}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-12" data-testid="empty-state">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No content yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first {activeTab.replace("-", " ")} entry
          </p>
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
          <Card
            key={item.id}
            className="hover:shadow-md transition-shadow"
            data-testid={`content-item-${item.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="font-semibold text-lg"
                      data-testid={`item-title-${item.id}`}
                    >
                      {item.title}
                    </h3>
                    {item.category && (
                      <Badge
                        variant="secondary"
                        data-testid={`item-category-${item.id}`}
                      >
                        {item.category}
                      </Badge>
                    )}
                    {item.difficulty && (
                      <Badge
                        variant={
                          item.difficulty === "easy"
                            ? "default"
                            : item.difficulty === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                        data-testid={`item-difficulty-${item.id}`}
                      >
                        {item.difficulty}
                      </Badge>
                    )}
                  </div>

                  {item.company && (
                    <p
                      className="text-sm text-muted-foreground mb-1"
                      data-testid={`item-company-${item.id}`}
                    >
                      {item.company} • {item.location} • {item.salaryRange}
                    </p>
                  )}

                  {item.excerpt && (
                    <p
                      className="text-sm text-muted-foreground mb-1"
                      data-testid={`item-excerpt-${item.id}`}
                    >
                      {item.excerpt}
                    </p>
                  )}

                  {item.description && (
                    <p
                      className="text-sm text-muted-foreground line-clamp-2"
                      data-testid={`item-description-${item.id}`}
                    >
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span data-testid={`item-created-${item.id}`}>
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.isActive !== undefined && (
                      <Badge
                        variant={item.isActive ? "default" : "secondary"}
                        data-testid={`item-status-${item.id}`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    )}
                    {item.isPublished !== undefined && (
                      <Badge
                        variant={item.isPublished ? "default" : "secondary"}
                        data-testid={`item-published-${item.id}`}
                      >
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
              <h1 className="text-2xl font-bold" data-testid="admin-title">
                Admin Dashboard
              </h1>
              <Badge variant="secondary" data-testid="admin-badge">
                Content Management
              </Badge>
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
              <Button
                onClick={() => setSelectedItem({})}
                data-testid="button-add-content"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statsArray.map((stat, index) => (
            <Card
              key={index}
              data-testid={`stat-card-${stat.label.toLowerCase().replace(" ", "-")}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg bg-muted mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium text-muted-foreground"
                      data-testid={`stat-label-${stat.label.toLowerCase().replace(" ", "-")}`}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="text-2xl font-bold"
                      data-testid={`stat-value-${stat.label.toLowerCase().replace(" ", "-")}`}
                    >
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
                <CardTitle className="text-lg" data-testid="sidebar-title">
                  Content Types
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors ${
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                      data-testid={`sidebar-item-${item.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        data-testid={`sidebar-count-${item.id}`}
                      >
                        {item.count}
                      </Badge>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* AI Generator Panel */}
            {showAiGenerator && (
              <div className="space-y-6 mb-6">
                <Card>
                  <AiGenerator
                    onContentGenerated={(content) => {
                      let targetTab = activeTab;
                      if (
                        content.difficulty &&
                        (content.timeComplexity || content.spaceComplexity)
                      ) {
                        targetTab = "dsa-corner";
                      } else if (content.steps || content.technologies) {
                        targetTab = "roadmaps";
                      } else if (content.content && content.author) {
                        targetTab = "articles";
                      } else if (content.company && content.location) {
                        targetTab = "jobs";
                      } else if (content.eligibility && content.deadline) {
                        targetTab = "scholarships";
                      }

                      if (targetTab !== activeTab) {
                        setActiveTab(targetTab);
                      }

                      setSelectedItem(content);
                      setShowAiGenerator(false);
                    }}
                  />
                </Card>

                {selectedItem && (
                  <AdminAgent
                    selectedContent={selectedItem}
                    contentType={activeTab}
                    onTemplateGenerated={(template) => {
                      console.log("Template generated:", template);
                      toast({
                        title: "Template Generated",
                        description:
                          "Marketing template has been created successfully.",
                      });
                    }}
                  />
                )}
              </div>
            )}

            {selectedItem ? (
              <ContentForm
                type={
                  activeTab === "fresher-jobs" || activeTab === "internships"
                    ? "jobs"
                    : activeTab
                }
                item={
                  activeTab === "fresher-jobs"
                    ? { ...selectedItem, category: "fresher-job" }
                    : activeTab === "internships"
                      ? { ...selectedItem, category: "internship" }
                      : selectedItem
                }
                onSave={() => {
                  setSelectedItem(null);
                  queryClient.invalidateQueries();
                }}
                onCancel={() => setSelectedItem(null)}
              />
            ) : (
              <Card data-testid="content-list">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle
                    className="text-xl capitalize"
                    data-testid="content-list-title"
                  >
                    {activeTab.replace("-", " ")} Management
                  </CardTitle>
                  <Button
                    onClick={() => setSelectedItem({})}
                    data-testid="button-add-new"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>{renderContentList()}</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}
