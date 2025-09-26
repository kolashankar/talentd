import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Share,
  Copy,
} from "lucide-react";
import { z } from "zod";

interface PortfolioBuilderProps {
  portfolio: Portfolio | null;
  onSave: () => void;
  onCancel: () => void;
}

export function PortfolioBuilder({
  portfolio,
  onSave,
  onCancel,
}: PortfolioBuilderProps) {
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
  const [showAiHelper, setShowAiHelper] = useState(true);
  const [location, setLocation] = useState("");

  // AI Portfolio Assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [websiteCode, setWebsiteCode] = useState({ html: "", css: "", js: "" });
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();
  const isEditingPortfolio = Boolean(portfolio?.id);

  const form = useForm({
    resolver: zodResolver(insertPortfolioSchema),
    defaultValues: {
      userId: "user-1", // In a real app, this would come from auth
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
      const endpoint = isEditingPortfolio
        ? `/api/portfolios/${portfolio?.id}`
        : "/api/portfolios";
      const method = isEditingPortfolio ? "PUT" : "POST";
      const response = await apiRequest(method, endpoint, data);
      return await response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: `Portfolio ${isEditingPortfolio ? "updated" : "created"} successfully`,
        action: !isEditingPortfolio ? (
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

  const generateWebsiteMutation = useMutation({
    mutationFn: async (data: { prompt: string; resumeFile?: File }) => {
      const formData = new FormData();
      formData.append('prompt', data.prompt);
      if (data.resumeFile) {
        formData.append('resume', data.resumeFile);
      }

      const response = await fetch('/api/portfolio/generate-complete', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for session authentication
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate website' }));
        throw new Error(errorData.message || 'Failed to generate website');
      }
      return response.json();
    },
    onSuccess: (result) => {
      setGeneratedWebsite(result.portfolioData);
      setWebsiteCode(result.portfolioCode);
      toast({
        title: "Website Generated!",
        description: "Your AI-powered portfolio website has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editWebsiteMutation = useMutation({
    mutationFn: async (editPrompt: string) => {
      const response = await apiRequest('POST', '/api/ai/generate-content', {
        type: 'portfolio-edit',
        prompt: `Edit this portfolio website: ${editPrompt}. Current code: ${JSON.stringify(websiteCode)}`,
        details: {
          generateImages: true,
          generateAnimations: true,
          customStyling: true
        }
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.htmlCode || result.html) {
        setWebsiteCode({
          html: result.htmlCode || result.html || websiteCode.html,
          css: result.cssCode || result.css || websiteCode.css,
          js: result.jsCode || result.js || websiteCode.js
        });
      }
      toast({
        title: "Website Updated!",
        description: "Your portfolio has been edited successfully",
      });
      setEditPrompt("");
    },
    onError: (error: Error) => {
      toast({
        title: "Edit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadWebsiteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/portfolio/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioCode: websiteCode }),
      });

      if (!response.ok) throw new Error('Download failed');
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'portfolio-website.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download Started",
        description: "Your portfolio website is being downloaded",
      });
    },
  });

  const parseResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsParsingResume(true);
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/portfolio/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to parse resume");
      return response.json();
    },
    onSuccess: (parsedData) => {
      Object.keys(parsedData).forEach((key) => {
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

  const handleGenerateWebsite = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please provide a description for your portfolio website",
        variant: "destructive",
      });
      return;
    }

    generateWebsiteMutation.mutate({ prompt: aiPrompt, resumeFile: resumeFile || undefined });
  };

  const handleEditWebsite = () => {
    if (!editPrompt.trim()) {
      toast({
        title: "Missing Edit Instructions",
        description: "Please describe what changes you'd like to make",
        variant: "destructive",
      });
      return;
    }

    editWebsiteMutation.mutate(editPrompt);
  };

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      skills,
      projects,
      experience,
      education,
      profileImage: profileImage
        ? `/uploads/profiles/${profileImage.name}`
        : data.profileImage,
      resumeUrl: resumeFile
        ? `/uploads/resumes/${resumeFile.name}`
        : data.resumeUrl,
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
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        technologies: [],
        demoUrl: "",
        githubUrl: "",
        image: "",
      },
    ]);
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
    setExperience([
      ...experience,
      {
        title: "",
        company: "",
        duration: "",
        description: "",
      },
    ]);
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
    setEducation([
      ...education,
      {
        degree: "",
        institution: "",
        year: "",
        grade: "",
      },
    ]);
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
    { id: "ai-assistant", label: "AI Assistant", icon: Bot },
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
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(false)}
                  data-testid="button-exit-preview"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Exit Preview
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={saveMutation.isPending}
                  data-testid="button-save-portfolio"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditingPortfolio ? "Update Portfolio" : "Create Portfolio"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Website Preview or Form Preview */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {websiteCode.html ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Generated Website Preview</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewMode(false)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => downloadWebsiteMutation.mutate()}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <iframe
                    srcDoc={websiteCode.html}
                    className="w-full h-[600px] border-0"
                    title="Portfolio Preview"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="overflow-hidden" data-testid="portfolio-preview">
              {/* Header */}
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
                    <h1 className="text-3xl font-bold mb-2" data-testid="preview-name">
                      {form.watch("name") || "Your Name"}
                    </h1>
                    <p className="text-xl opacity-90 mb-3" data-testid="preview-title">
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
                      {form.watch("linkedin") && <Linkedin className="h-4 w-4" />}
                      {form.watch("github") && <Github className="h-4 w-4" />}
                      {form.watch("website") && <Globe className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-8">
                {/* Bio */}
                {form.watch("bio") && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p
                      className="text-muted-foreground leading-relaxed"
                      data-testid="preview-bio"
                    >
                      {form.watch("bio")}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          data-testid={`preview-skill-${index}`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Projects</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {projects.map((project, index) => (
                        <Card
                          key={index}
                          className="p-4"
                          data-testid={`preview-project-${index}`}
                        >
                          <h3 className="font-semibold mb-2">
                            {project.title || `Project ${index + 1}`}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {project.description || "Project description"}
                          </p>
                          {project.technologies &&
                            project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {project.technologies.map((tech, techIndex) => (
                                  <Badge
                                    key={techIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          <div className="flex space-x-2">
                            {project.demoUrl && (
                              <Button variant="outline" size="sm">
                                <Globe className="mr-1 h-3 w-3" />
                                Demo
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button variant="outline" size="sm">
                                <Github className="mr-1 h-3 w-3" />
                                Code
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Experience</h2>
                    <div className="space-y-4">
                      {experience.map((exp, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-primary pl-4"
                          data-testid={`preview-experience-${index}`}
                        >
                          <h3 className="font-semibold">
                            {exp.title || "Job Title"}
                          </h3>
                          <p className="text-primary font-medium">
                            {exp.company || "Company"}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {exp.duration || "Duration"}
                          </p>
                          <p className="text-sm">
                            {exp.description || "Job description"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Education</h2>
                    <div className="space-y-4">
                      {education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-secondary pl-4"
                          data-testid={`preview-education-${index}`}
                        >
                          <h3 className="font-semibold">
                            {edu.degree || "Degree"}
                          </h3>
                          <p className="text-secondary font-medium">
                            {edu.institution || "Institution"}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{edu.year || "Year"}</span>
                            {edu.grade && <span>Grade: {edu.grade}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume */}
                {(resumeFile || form.watch("resumeUrl")) && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Resume</h2>
                    <Card className="p-6 text-center bg-muted/30">
                      <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="font-medium mb-2">Resume Available</p>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </Button>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
              <h1 className="text-2xl font-bold" data-testid="portfolio-builder-title">
                {isEditingPortfolio ? "Edit Portfolio" : "Create Portfolio"}
              </h1>
              <Badge variant="secondary">Portfolio Builder</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onCancel} data-testid="button-cancel">
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviewMode(true)}
                data-testid="button-preview"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={saveMutation.isPending}
                data-testid="button-save"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditingPortfolio ? "Update" : "Create"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showAiHelper && (
        <div className="border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>AI Portfolio Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Upload Resume for Auto-Fill</Label>
                    <div className="mt-2">
                      <FileUpload
                        onFileSelect={(file) => {
                          setResumeFile(file);
                          parseResumeMutation.mutate(file);
                        }}
                        acceptedTypes={[".pdf", ".doc", ".docx"]}
                        maxSize={5 * 1024 * 1024}
                        disabled={isParsingResume}
                      />
                      {isParsingResume && (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Parsing resume with AI...
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>AI Quick Actions</Label>
                    <div className="mt-2 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          const skills = form.watch("skills") || [];
                          const experience = form.watch("experience") || [];
                          if (skills.length > 0 || experience.length > 0) {
                            const summary = `Passionate ${form.watch("title") || "professional"} with expertise in ${skills.slice(0, 3).join(", ")}. ${experience.length > 0 ? `With ${experience.length} years of experience in the industry.` : ""}`;
                            form.setValue("bio", summary);
                            toast({
                              title: "Bio Generated",
                              description: "Professional bio has been generated based on your skills and experience.",
                            });
                          }
                        }}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Professional Bio
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          const title = form.watch("title")?.toLowerCase() || "";
                          let suggestedSkills: string[] = [];

                          if (title.includes("developer") || title.includes("engineer")) {
                            suggestedSkills = ["JavaScript", "React", "Node.js", "Python", "Git", "API Development"];
                          } else if (title.includes("designer")) {
                            suggestedSkills = ["Adobe Creative Suite", "Figma", "UI/UX Design", "Prototyping", "Typography"];
                          } else if (title.includes("data")) {
                            suggestedSkills = ["Python", "SQL", "Data Analysis", "Machine Learning", "Pandas", "Tableau"];
                          } else {
                            suggestedSkills = ["Communication", "Problem Solving", "Team Leadership", "Project Management"];
                          }

                          setSkills((prev) => [...new Set([...prev, ...suggestedSkills])]);
                          toast({
                            title: "Skills Suggested",
                            description: "Relevant skills have been added based on your title.",
                          });
                        }}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Suggest Relevant Skills
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-6" data-testid="portfolio-tabs">
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
                        activeTab === tab.id ? "bg-primary text-primary-foreground" : ""
                      }`}
                      data-testid={`tab-${tab.id}`}
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
              {/* AI Assistant Tab */}
              {activeTab === "ai-assistant" && (
                <Card data-testid="ai-assistant-section">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5" />
                      <span>AI Portfolio Website Generator</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Website Generation */}
                    <div>
                      <Label htmlFor="ai-prompt">Describe Your Dream Portfolio *</Label>
                      <Textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Describe what kind of portfolio website you want. For example: 'Create a modern, minimalist portfolio for a full-stack developer with dark theme, smooth animations, and professional project showcases. Include contact form and social links.'"
                        rows={4}
                        className="resize-vertical"
                        data-testid="ai-prompt-textarea"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Be specific about design style, colors, layout, and features you want
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        type="button"
                        onClick={handleGenerateWebsite}
                        disabled={generateWebsiteMutation.isPending || !aiPrompt.trim()}
                        className="w-full"
                        size="lg"
                        data-testid="generate-website-button"
                      >
                        {generateWebsiteMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating Website...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Website
                          </>
                        )}
                      </Button>

                      {websiteCode.html && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPreviewMode(true)}
                          className="w-full"
                          size="lg"
                        >
                          <Eye className="mr-2 h-5 w-5" />
                          Preview Website
                        </Button>
                      )}
                    </div>

                    {/* Website Editing */}
                    {websiteCode.html && (
                      <Card className="border-accent/20 bg-accent/5">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-lg">
                            <Edit className="h-4 w-4" />
                            <span>Edit Your Website</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>What changes would you like to make?</Label>
                            <Textarea
                              value={editPrompt}
                              onChange={(e) => setEditPrompt(e.target.value)}
                              placeholder="Describe the changes you want. For example: 'Make the header background blue, add a testimonials section, change the font to modern sans-serif, add hover effects to buttons'"
                              rows={3}
                              className="resize-vertical"
                            />
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              onClick={handleEditWebsite}
                              disabled={editWebsiteMutation.isPending || !editPrompt.trim()}
                              className="flex-1"
                            >
                              {editWebsiteMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Applying Changes...
                                </>
                              ) : (
                                <>
                                  <Palette className="mr-2 h-4 w-4" />
                                  Apply Changes
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Download & Share */}
                    {websiteCode.html && (
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-lg text-green-800">
                            <Download className="h-4 w-4" />
                            <span>Download & Share</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-3">
                            <Button
                              type="button"
                              onClick={() => downloadWebsiteMutation.mutate()}
                              disabled={downloadWebsiteMutation.isPending}
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                            >
                              {downloadWebsiteMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              Download Code
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => {
                                navigator.clipboard.writeText(websiteCode.html);
                                toast({ title: "Copied!", description: "HTML code copied to clipboard" });
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy HTML
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                            >
                              <Share className="mr-2 h-4 w-4" />
                              Share Link
                            </Button>
                          </div>

                          <div className="text-sm text-green-700 bg-white/50 p-3 rounded-lg">
                            <p className="font-medium mb-1">✨ Your website includes:</p>
                            <ul className="text-xs space-y-1">
                              <li>• Responsive design for all devices</li>
                              <li>• Modern animations and effects</li>
                              <li>• Optimized images and assets</li>
                              <li>• Clean, professional code structure</li>
                              <li>• Ready to deploy anywhere</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {generatedWebsite && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Generated Portfolio Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-48">
                            {JSON.stringify(generatedWebsite, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Basic Information */}
              {activeTab === "basic" && (
                <Card data-testid="basic-info-section">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Image */}
                    <div>
                      <Label>Profile Image</Label>
                      <FileUpload
                        onFileSelect={handleProfileImageSelect}
                        acceptedTypes={[".jpg", ".jpeg", ".png"]}
                        maxSize={2 * 1024 * 1024} // 2MB
                        data-testid="profile-image-upload"
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
                        <Input
                          {...form.register("name")}
                          placeholder="John Doe"
                          data-testid="input-name"
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="title">Professional Title *</Label>
                        <Input
                          {...form.register("title")}
                          placeholder="Full Stack Developer"
                          data-testid="input-title"
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.title.message}
                          </p>
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
                        data-testid="textarea-bio"
                      />
                      {form.formState.errors.bio && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.bio.message}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          {...form.register("email")}
                          type="email"
                          placeholder="john@example.com"
                          data-testid="input-email"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          {...form.register("phone")}
                          placeholder="+1 (555) 123-4567"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          {...form.register("website")}
                          placeholder="https://johndoe.com"
                          data-testid="input-website"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          {...form.register("linkedin")}
                          placeholder="https://linkedin.com/in/johndoe"
                          data-testid="input-linkedin"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          {...form.register("github")}
                          placeholder="https://github.com/johndoe"
                          data-testid="input-github"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Skills</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          data-testid="input-skill"
                        />
                        <Button type="button" onClick={addSkill} data-testid="button-add-skill">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                            data-testid={`skill-badge-${index}`}
                          >
                            {skill}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeSkill(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <Label>Resume</Label>
                      <FileUpload
                        onFileSelect={handleResumeSelect}
                        acceptedTypes={[".pdf", ".doc", ".docx"]}
                        maxSize={5 * 1024 * 1024} // 5MB
                        data-testid="resume-upload"
                      />
                      {resumeFile && (
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

              {/* Projects */}
              {activeTab === "projects" && (
                <Card data-testid="projects-section">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <span>Projects</span>
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={addProject}
                      data-testid="button-add-project"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No projects yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Add your projects to showcase your work
                        </p>
                        <Button
                          onClick={addProject}
                          data-testid="button-add-first-project"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Project
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {projects.map((project, index) => (
                          <Card
                            key={index}
                            className="p-4"
                            data-testid={`project-${index}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">
                                Project {index + 1}
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeProject(index)}
                                data-testid={`button-remove-project-${index}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Project Title *</Label>
                                <Input
                                  value={project.title}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="My Awesome Project"
                                  data-testid={`input-project-title-${index}`}
                                />
                              </div>
                              <div>
                                <Label>Technologies</Label>
                                <Input
                                  value={project.technologies.join(", ")}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "technologies",
                                      e.target.value
                                        .split(",")
                                        .map((t) => t.trim())
                                        .filter((t) => t),
                                    )
                                  }
                                  placeholder="React, Node.js, MongoDB"
                                  data-testid={`input-project-technologies-${index}`}
                                />
                              </div>
                            </div>
                            <div className="mt-4">
                              <Label>Description *</Label>
                              <Textarea
                                value={project.description}
                                onChange={(e) =>
                                  updateProject(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Describe your project, what it does, and what you learned..."
                                rows={3}
                                data-testid={`textarea-project-description-${index}`}
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>Demo URL</Label>
                                <Input
                                  value={project.demoUrl || ""}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "demoUrl",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="https://myproject.com"
                                  data-testid={`input-project-demo-${index}`}
                                />
                              </div>
                              <div>
                                <Label>GitHub URL</Label>
                                <Input
                                  value={project.githubUrl || ""}
                                  onChange={(e) =>
                                    updateProject(
                                      index,
                                      "githubUrl",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="https://github.com/user/repo"
                                  data-testid={`input-project-github-${index}`}
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

              {/* Experience */}
              {activeTab === "experience" && (
                <Card data-testid="experience-section">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <span>Work Experience</span>
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={addExperience}
                      data-testid="button-add-experience"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Experience
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {experience.length === 0 ? (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No experience yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Add your work experience and internships
                        </p>
                        <Button
                          onClick={addExperience}
                          data-testid="button-add-first-experience"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Experience
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {experience.map((exp, index) => (
                          <Card
                            key={index}
                            className="p-4"
                            data-testid={`experience-${index}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">
                                Experience {index + 1}
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeExperience(index)}
                                data-testid={`button-remove-experience-${index}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Job Title *</Label>
                                <Input
                                  value={exp.title}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Software Engineer"
                                  data-testid={`input-experience-title-${index}`}
                                />
                              </div>
                              <div>
                                <Label>Company *</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "company",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Tech Company Inc."
                                  data-testid={`input-experience-company-${index}`}
                                />
                              </div>
                            </div>
                            <div className="mt-4">
                              <Label>Duration *</Label>
                              <Input
                                value={exp.duration}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "duration",
                                    e.target.value,
                                  )
                                }
                                placeholder="Jan 2023 - Present"
                                data-testid={`input-experience-duration-${index}`}
                              />
                            </div>
                            <div className="mt-4">
                              <Label>Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Describe your role, responsibilities, and achievements..."
                                rows={3}
                                data-testid={`textarea-experience-description-${index}`}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {activeTab === "education" && (
                <Card data-testid="education-section">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5" />
                      <span>Education</span>
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={addEducation}
                      data-testid="button-add-education"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {education.length === 0 ? (
                      <div className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No education yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Add your educational background
                        </p>
                        <Button
                          onClick={addEducation}
                          data-testid="button-add-first-education"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your Education
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {education.map((edu, index) => (
                          <Card
                            key={index}
                            className="p-4"
                            data-testid={`education-${index}`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">
                                Education {index + 1}
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeEducation(index)}
                                data-testid={`button-remove-education-${index}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Degree *</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "degree",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Bachelor of Computer Science"
                                  data-testid={`input-education-degree-${index}`}
                                />
                              </div>
                              <div>
                                <Label>Institution *</Label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "institution",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="University of Technology"
                                  data-testid={`input-education-institution-${index}`}
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>Year *</Label>
                                <Input
                                  value={edu.year}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "year",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="2020-2024"
                                  data-testid={`input-education-year-${index}`}
                                />
                              </div>
                              <div>
                                <Label>Grade/GPA</Label>
                                <Input
                                  value={edu.grade || ""}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "grade",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="3.8/4.0"
                                  data-testid={`input-education-grade-${index}`}
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

              {/* Settings */}
              {activeTab === "settings" && (
                <Card data-testid="settings-section">
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
                        <p className="text-sm text-muted-foreground">
                          Make your portfolio visible to everyone
                        </p>
                      </div>
                      <Switch
                        checked={form.watch("isPublic")}
                        onCheckedChange={(checked) =>
                          form.setValue("isPublic", checked)
                        }
                        data-testid="switch-public"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customDomain">Custom Domain</Label>
                      <Input
                        {...form.register("customDomain")}
                        placeholder="johndoe.dev"
                        data-testid="input-custom-domain"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Optional: Use your own domain for professional branding
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        onValueChange={(value) => form.setValue("theme", value)}
                        defaultValue={form.getValues("theme")}
                      >
                        <SelectTrigger data-testid="select-theme">
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