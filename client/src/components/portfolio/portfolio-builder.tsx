
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { insertPortfolioSchema, Portfolio } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  X, 
  Plus, 
  Save, 
  Eye, 
  User, 
  Briefcase, 
  GraduationCap, 
  Link,
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
  FileText,
  Loader2,
  Upload,
  Trash2,
  Edit,
  Bot,
  Wand2,
  Download,
  Code,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Layout,
  Monitor
} from "lucide-react";
import { z } from "zod";

interface PortfolioBuilderProps {
  portfolio: Portfolio | null;
  onSave: () => void;
  onCancel: () => void;
}

export function PortfolioBuilder({ portfolio, onSave, onCancel }: PortfolioBuilderProps) {
  const [skills, setSkills] = useState<string[]>(portfolio?.skills || []);
  const [projects, setProjects] = useState(portfolio?.projects || []);
  const [experience, setExperience] = useState(portfolio?.experience || []);
  const [education, setEducation] = useState(portfolio?.education || []);
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [previewMode, setPreviewMode] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);
  const [isGeneratingWebsite, setIsGeneratingWebsite] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [, setLocation] = useLocation();

  const { toast } = useToast();
  const isEditing = Boolean(portfolio?.id);

  const form = useForm({
    resolver: zodResolver(insertPortfolioSchema),
    defaultValues: {
      userId: "user-1",
      name: portfolio?.name || "",
      title: portfolio?.title || "",
      bio: portfolio?.bio || "",
      email: portfolio?.email || "",
      phone: portfolio?.phone || "",
      website: portfolio?.website || "",
      linkedin: portfolio?.linkedin || "",
      github: portfolio?.github || "",
      profileImage: portfolio?.profileImage || "",
      resumeUrl: portfolio?.resumeUrl || "",
      projects: portfolio?.projects || [],
      skills: portfolio?.skills || [],
      experience: portfolio?.experience || [],
      education: portfolio?.education || [],
      isPublic: portfolio?.isPublic || false,
      customDomain: portfolio?.customDomain || "",
      theme: portfolio?.theme || "default",
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = isEditing ? `/api/portfolios/${portfolio?.id}` : '/api/portfolios';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await apiRequest(method, endpoint, data);
      return await response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: `Portfolio ${isEditing ? 'updated' : 'created'} successfully`,
        action: !isEditing ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation(`/portfolio/${result.id}`)}
          >
            View Portfolio
          </Button>
        ) : undefined,
      });
      onSave();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const parseResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsParsingResume(true);
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/portfolio/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to parse resume');
      return await response.json();
    },
    onSuccess: (parsedData) => {
      Object.keys(parsedData).forEach(key => {
        if (parsedData[key] !== undefined && parsedData[key] !== null) {
          form.setValue(key as any, parsedData[key]);
        }
      });

      if (parsedData.skills) setSkills(parsedData.skills);
      if (parsedData.projects) setProjects(parsedData.projects);
      if (parsedData.experience) setExperience(parsedData.experience);
      if (parsedData.education) setEducation(parsedData.education);

      setIsParsingResume(false);
      toast({
        title: "Resume Parsed Successfully",
        description: "Your portfolio has been auto-filled with resume data. Please review and edit as needed.",
      });
    },
    onError: (error: Error) => {
      setIsParsingResume(false);
      toast({
        title: "Parse Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateWebsiteMutation = useMutation({
    mutationFn: async (data: { prompt: string; portfolioData: any; resume?: File }) => {
      setIsGeneratingWebsite(true);
      const formData = new FormData();
      formData.append('prompt', data.prompt);
      formData.append('portfolioData', JSON.stringify(data.portfolioData));
      
      if (data.resume) {
        formData.append('resume', data.resume);
      }

      const response = await fetch('/api/portfolio/generate-complete', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to generate website');
      return await response.json();
    },
    onSuccess: (result) => {
      setGeneratedWebsite(result);
      setIsGeneratingWebsite(false);
      toast({
        title: "Website Generated Successfully",
        description: "Your portfolio website has been generated with modern UI and animations!",
      });
    },
    onError: (error: Error) => {
      setIsGeneratingWebsite(false);
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadWebsite = async () => {
    if (!generatedWebsite) return;

    try {
      const response = await fetch('/api/portfolio/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioCode: generatedWebsite.portfolioCode
        }),
      });

      if (!response.ok) throw new Error('Failed to prepare download');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'portfolio-website.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your portfolio website is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the website.",
        variant: "destructive",
      });
    }
  };

  const generateCompleteWebsite = () => {
    const portfolioData = {
      ...form.getValues(),
      skills,
      projects,
      experience,
      education
    };

    generateWebsiteMutation.mutate({
      prompt: aiPrompt || "Create a modern, professional portfolio website with animations and great UI/UX",
      portfolioData,
      resume: resumeFile || undefined
    });
  };

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      skills,
      projects,
      experience,
      education,
      profileImage: profileImage ? `/uploads/profiles/${profileImage.name}` : data.profileImage,
      resumeUrl: resumeFile ? `/uploads/resumes/${resumeFile.name}` : data.resumeUrl,
    };

    saveMutation.mutate(formData);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects([...projects, {
      title: "",
      description: "",
      technologies: [],
      demoUrl: "",
      githubUrl: "",
      image: ""
    }]);
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience([...experience, {
      title: "",
      company: "",
      duration: "",
      description: ""
    }]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setExperience(updatedExperience);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, {
      degree: "",
      institution: "",
      year: "",
      grade: ""
    }]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEducation(updatedEducation);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleProfileImageSelect = (file: File) => {
    setProfileImage(file);
  };

  const handleResumeSelect = (file: File) => {
    setResumeFile(file);
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "ai-website", label: "AI Website Generator", icon: Wand2 },
    { id: "settings", label: "Settings", icon: Globe },
  ];

  if (previewMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold">Portfolio Preview</h1>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Exit Preview
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? 'Update Portfolio' : 'Create Portfolio'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
              <div className="flex items-center space-x-6">
                {profileImage ? (
                  <img 
                    src={URL.createObjectURL(profileImage)} 
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                  />
                ) : form.watch("profileImage") ? (
                  <img 
                    src={form.watch("profileImage")} 
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-12 w-12" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {form.watch("name") || "Your Name"}
                  </h1>
                  <p className="text-xl opacity-90 mb-3">
                    {form.watch("title") || "Your Professional Title"}
                  </p>
                  <div className="flex items-center space-x-4">
                    {form.watch("email") && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{form.watch("email")}</span>
                      </div>
                    )}
                    {form.watch("phone") && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{form.watch("phone")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              {form.watch("bio") && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {form.watch("bio")}
                  </p>
                </div>
              )}

              {skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {projects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Projects</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                      <Card key={index} className="p-4">
                        <h3 className="font-semibold mb-2">{project.title || `Project ${index + 1}`}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description || "Project description"}
                        </p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Portfolio' : 'Create Portfolio'}
              </h1>
              <Badge variant="secondary">Portfolio Builder</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Portfolio Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                        activeTab === tab.id ? 'bg-primary text-primary-foreground' : ''
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {activeTab === "basic" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Profile Image</Label>
                      <FileUpload
                        onFileSelect={handleProfileImageSelect}
                        acceptedTypes={['.jpg', '.jpeg', '.png']}
                        maxSize={2 * 1024 * 1024}
                      />
                      {profileImage && (
                        <div className="mt-3 flex items-center space-x-3">
                          <img 
                            src={URL.createObjectURL(profileImage)} 
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{profileImage.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(profileImage.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input {...form.register("name")} placeholder="John Doe" />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title *</Label>
                        <Input {...form.register("title")} placeholder="Full Stack Developer" />
                        {form.formState.errors.title && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio *</Label>
                      <Textarea 
                        {...form.register("bio")} 
                        rows={5}
                        placeholder="Tell us about yourself, your passion, and your goals..."
                        className="resize-vertical"
                      />
                      {form.formState.errors.bio && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.bio.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input {...form.register("email")} type="email" placeholder="john@example.com" />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input {...form.register("phone")} placeholder="+1 (555) 123-4567" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input {...form.register("website")} placeholder="https://johndoe.com" />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input {...form.register("linkedin")} placeholder="https://linkedin.com/in/johndoe" />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input {...form.register("github")} placeholder="https://github.com/johndoe" />
                      </div>
                    </div>

                    <div>
                      <Label>Skills</Label>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeSkill(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Resume for Auto-Fill</Label>
                      <FileUpload
                        onFileSelect={(file) => {
                          if (!isParsingResume) {
                            setResumeFile(file);
                            parseResumeMutation.mutate(file);
                          }
                        }}
                        acceptedTypes={['.pdf', '.doc', '.docx']}
                        maxSize={5 * 1024 * 1024}
                      />
                      {isParsingResume && (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Parsing resume with AI...
                        </div>
                      )}
                      {resumeFile && !isParsingResume && (
                        <div className="mt-3 flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{resumeFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "projects" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <span>Projects</span>
                    </CardTitle>
                    <Button type="button" onClick={addProject}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                        <p className="text-muted-foreground mb-6">Add your projects to showcase your work</p>
                        <Button onClick={addProject}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Project
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {projects.map((project, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">Project {index + 1}</h3>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeProject(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Project Title *</Label>
                                <Input 
                                  value={project.title}
                                  onChange={(e) => updateProject(index, 'title', e.target.value)}
                                  placeholder="My Awesome Project"
                                />
                              </div>
                              <div>
                                <Label>Technologies</Label>
                                <Input 
                                  value={project.technologies.join(', ')}
                                  onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                            </div>
                            <div className="mt-4">
                              <Label>Description *</Label>
                              <Textarea 
                                value={project.description}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                placeholder="Describe your project, what it does, and what you learned..."
                                rows={3}
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>Demo URL</Label>
                                <Input 
                                  value={project.demoUrl || ''}
                                  onChange={(e) => updateProject(index, 'demoUrl', e.target.value)}
                                  placeholder="https://myproject.com"
                                />
                              </div>
                              <div>
                                <Label>GitHub URL</Label>
                                <Input 
                                  value={project.githubUrl || ''}
                                  onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                                  placeholder="https://github.com/user/repo"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "experience" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <span>Work Experience</span>
                    </CardTitle>
                    <Button type="button" onClick={addExperience}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Experience
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {experience.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No experience yet</h3>
                        <p className="text-muted-foreground mb-6">Add your work experience and internships</p>
                        <Button onClick={addExperience}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Experience
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {experience.map((exp, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">Experience {index + 1}</h3>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeExperience(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Job Title *</Label>
                                <Input 
                                  value={exp.title}
                                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                  placeholder="Software Engineer"
                                />
                              </div>
                              <div>
                                <Label>Company *</Label>
                                <Input 
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                  placeholder="Tech Company Inc."
                                />
                              </div>
                            </div>
                            <div className="mt-4">
                              <Label>Duration *</Label>
                              <Input 
                                value={exp.duration}
                                onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                                placeholder="Jan 2023 - Present"
                              />
                            </div>
                            <div className="mt-4">
                              <Label>Description</Label>
                              <Textarea 
                                value={exp.description}
                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                placeholder="Describe your role, responsibilities, and achievements..."
                                rows={3}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "education" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5" />
                      <span>Education</span>
                    </CardTitle>
                    <Button type="button" onClick={addEducation}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {education.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No education yet</h3>
                        <p className="text-muted-foreground mb-6">Add your educational background</p>
                        <Button onClick={addEducation}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your Education
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {education.map((edu, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">Education {index + 1}</h3>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeEducation(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Degree *</Label>
                                <Input 
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                  placeholder="Bachelor of Computer Science"
                                />
                              </div>
                              <div>
                                <Label>Institution *</Label>
                                <Input 
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                  placeholder="University of Technology"
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>Year *</Label>
                                <Input 
                                  value={edu.year}
                                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                                  placeholder="2020-2024"
                                />
                              </div>
                              <div>
                                <Label>Grade/GPA</Label>
                                <Input 
                                  value={edu.grade || ''}
                                  onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                                  placeholder="3.8/4.0"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "ai-website" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wand2 className="h-5 w-5" />
                      <span>AI Website Generator</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-semibold">Generate Complete Portfolio Website</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Create a stunning, professional portfolio website with modern UI/UX, animations, and visual assets using AI.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Custom Prompt (Optional)</Label>
                          <Textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g., Create a minimalist portfolio with dark theme and smooth animations..."
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Generate Images & Logos</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Layout className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Modern UI/UX Design</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Palette className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Custom Animations</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Monitor className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">Responsive Design</span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={generateCompleteWebsite}
                          disabled={isGeneratingWebsite}
                          className="w-full"
                          size="lg"
                        >
                          {isGeneratingWebsite ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Generating Website...
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-5 w-5" />
                              Generate Complete Website
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {generatedWebsite && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Generated Website</h3>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={downloadWebsite}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                const newWindow = window.open();
                                if (newWindow && generatedWebsite.portfolioCode?.html) {
                                  newWindow.document.write(generatedWebsite.portfolioCode.html);
                                  newWindow.document.close();
                                }
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Generated Files:</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center space-x-1">
                              <Code className="h-3 w-3" />
                              <span>index.html</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Code className="h-3 w-3" />
                              <span>styles.css</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Code className="h-3 w-3" />
                              <span>script.js</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Portfolio Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isPublic">Public Portfolio</Label>
                        <p className="text-sm text-muted-foreground">Make your portfolio visible to everyone</p>
                      </div>
                      <Switch 
                        checked={form.watch("isPublic")}
                        onCheckedChange={(checked) => form.setValue("isPublic", checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="customDomain">Custom Domain</Label>
                      <Input 
                        {...form.register("customDomain")} 
                        placeholder="johndoe.dev"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Optional: Use your own domain for professional branding
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select onValueChange={(value) => form.setValue("theme", value)} defaultValue={form.getValues("theme")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
