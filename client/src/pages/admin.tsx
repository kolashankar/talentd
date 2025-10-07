import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SecondaryNavbar } from "@/components/secondary-navbar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  Code,
  Award,
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  FileText,
  Upload,
  Download,
  Eye,
  Loader2,
} from "lucide-react";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("jobs");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  const validAdminCodes = ["admin123", "ADMIN2024", "admin", "password"];

  // Template upload mutation - moved before conditional return
  const uploadTemplateMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("template", file);

      const response = await fetch("/api/admin/templates/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload template");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setTemplateFile(null);
      setShowAddDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdminLogin = () => {
    if (validAdminCodes.includes(adminCode)) {
      setIsAdminVerified(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin code",
        variant: "destructive",
      });
    }
  };

  const handleTemplateUpload = async () => {
    if (!templateFile) {
      toast({
        title: "No File Selected",
        description: "Please select a .zip file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!templateFile.name.endsWith(".zip")) {
      toast({
        title: "Invalid File",
        description: "Please upload a .zip file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadTemplateMutation.mutateAsync(templateFile);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Enter the admin code to access this page.
            </p>
            <div className="space-y-2">
              <Label htmlFor="adminCode">Admin Code</Label>
              <Input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="Enter admin code"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdminLogin} className="flex-1">
                Access Admin Panel
              </Button>
              <Button variant="outline" onClick={() => setLocation("/")}>
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = [
    { id: "jobs", label: "Jobs", icon: Briefcase, count: 0 },
    { id: "fresher-jobs", label: "Fresher Jobs", icon: GraduationCap, count: 0 },
    { id: "internships", label: "Internships", icon: Briefcase, count: 0 },
    { id: "roadmaps", label: "Roadmaps", icon: BookOpen, count: 0 },
    { id: "articles", label: "Articles", icon: FileText, count: 0 },
    { id: "dsa-corner", label: "DSA Corner", icon: Code, count: 0 },
    { id: "scholarships", label: "Scholarships", icon: Award, count: 0 },
    { id: "portfolios", label: "Portfolios", icon: FolderOpen, count: 0 },
  ];

  const renderPortfoliosSection = () => {
    const { data: templatesData, isLoading } = useQuery({
      queryKey: ["/api/templates"],
    });

    const templates = templatesData?.database || [];

    const deleteTemplateMutation = useMutation({
      mutationFn: async (templateId: string) => {
        const response = await fetch(`/api/admin/templates/${templateId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete template");
        }
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Template deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete template",
          variant: "destructive",
        });
      },
    });

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Templates</h2>
            <p className="text-muted-foreground">
              Manage portfolio templates for users
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Portfolio Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Upload Template ZIP</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a .zip file containing your template
                  </p>
                  <Input
                    type="file"
                    accept=".zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTemplateFile(file);
                      }
                    }}
                    className="max-w-xs mx-auto"
                  />
                  {templateFile && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="font-medium">{templateFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(templateFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Template Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Must include manifest.json file</li>
                    <li>• Must include index.tsx entry file</li>
                    <li>• Optional: thumbnail.png (800x600px recommended)</li>
                    <li>• All files should be at the root level of the ZIP</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false);
                      setTemplateFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTemplateUpload}
                    disabled={!templateFile || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Template
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-40 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first portfolio template to get started
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: any) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  {template.thumbnailUrl ? (
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FolderOpen className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        v{template.version}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {template.isPremium && (
                        <Badge variant="secondary">Premium</Badge>
                      )}
                      {template.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                  </div>

                  {template.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span className="flex items-center">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </span>
                  </div>

                  {template.features && template.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.features.slice(0, 3).map((feature: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setLocation(`/admin-templates`)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplateMutation.mutate(template.templateId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "portfolios":
        return renderPortfoliosSection();
      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Content management for {activeSection} coming soon...
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SecondaryNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Content</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Templates</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Content Types</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors ${
                      activeSection === section.id ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="h-4 w-4" />
                      <span className="font-medium">{section.label}</span>
                    </div>
                    <Badge variant="secondary">{section.count}</Badge>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}