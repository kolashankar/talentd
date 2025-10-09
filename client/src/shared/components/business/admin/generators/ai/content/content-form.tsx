import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { FlowchartEditor } from "@/components/admin/flowchart-editor";
import { Node, Edge } from 'reactflow';
import { 
  insertJobSchema, 
  insertArticleSchema, 
  insertRoadmapSchema, 
  insertDsaProblemSchema,
  insertScholarshipSchema 
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus, Save, Loader2, Wand2 } from "lucide-react";
import { z } from "zod";

interface ContentFormProps {
  type: string;
  item: any;
  onSave: () => void;
  onCancel: () => void;
}

interface RoadmapStep {
  title: string;
  description: string;
  resources?: string[];
}

export function ContentForm({ type, item, onSave, onCancel }: ContentFormProps) {
  const [skills, setSkills] = useState<string[]>(item?.skills || []);
  const [tags, setTags] = useState<string[]>(item?.tags || []);
  const [technologies, setTechnologies] = useState<string[]>(item?.technologies || []);
  const [companies, setCompanies] = useState<string[]>(item?.companies || []);
  const [steps, setSteps] = useState(item?.steps || []);
  const [hints, setHints] = useState<string[]>(item?.hints || []);
  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [technologyInput, setTechnologyInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [hintInput, setHintInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [flowchartNodes, setFlowchartNodes] = useState<Node[]>(item?.flowchartData?.nodes || []);
  const [flowchartEdges, setFlowchartEdges] = useState<Edge[]>(item?.flowchartData?.edges || []);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");
  const [roadmapImageUrl, setRoadmapImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [flowchartFile, setFlowchartFile] = useState<File | null>(null);
  const [flowchartImageUrl, setFlowchartImageUrl] = useState<string>("");
  const [workflowImages, setWorkflowImages] = useState<string[]>([]);
  const [mindmapImages, setMindmapImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false); // State to track AI asset generation

  const { toast } = useToast();
  const isEditing = Boolean(item?.id);

  // Get the appropriate schema based on type
  const getSchema = () => {
    switch (type) {
      case "jobs":
      case "fresher-jobs":
      case "internships":
        return insertJobSchema;
      case "articles":
        return insertArticleSchema;
      case "roadmaps":
        return insertRoadmapSchema;
      case "dsa-corner":
        return insertDsaProblemSchema;
      case "scholarships":
        return insertScholarshipSchema;
      default:
        return insertJobSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      ...item,
      category: type === "fresher-jobs" ? "fresher-job" : type === "internships" ? "internship" : item?.category || "job",
    },
  });

  // Use a temporary state for form values to handle AI-generated content updates correctly
  const [formData, setFormData] = useState(form.getValues());

  useEffect(() => {
    if (item && Object.keys(item).length > 0) {
      // Reset form with new item data
      form.reset({
        ...item,
        category: type === "fresher-jobs" ? "fresher-job" : type === "internships" ? "internship" : item?.category || "job",
      });

      // Update arrays
      setSkills(item.skills || []);
      setTags(item.tags || []);
      setTechnologies(item.technologies || []);
      setCompanies(item.companies || []);
      setSteps(item.steps || []);
      setHints(item.hints || []);
      
      // Update flowchart data for roadmaps
      if (item.flowchartData) {
        setFlowchartNodes(item.flowchartData.nodes || []);
        setFlowchartEdges(item.flowchartData.edges || []);
      } else {
        setFlowchartNodes([]);
        setFlowchartEdges([]);
      }

      // Update image states
      setWorkflowImages(item.workflowImages || []);
      setMindmapImages(item.mindmapImages || []);
      setGeneratedImages(item.generatedImages || []);
      
      // Update image URLs
      setCompanyLogoUrl(item.companyLogo || '');
      setFeaturedImageUrl(item.featuredImage || '');
      setRoadmapImageUrl(item.image || '');
      setFlowchartImageUrl(item.flowchartImage || '');

      setFormData(item);
    } else {
      // Reset to empty form when creating new item
      form.reset({
        category: type === "fresher-jobs" ? "fresher-job" : type === "internships" ? "internship" : "job",
      });
      setSkills([]);
      setTags([]);
      setTechnologies([]);
      setCompanies([]);
      setSteps([]);
      setHints([]);
      setFlowchartNodes([]);
      setFlowchartEdges([]);
      setWorkflowImages([]);
      setMindmapImages([]);
      setGeneratedImages([]);
      setCompanyLogoUrl('');
      setFeaturedImageUrl('');
      setRoadmapImageUrl('');
      setFlowchartImageUrl('');
    }
  }, [item, form, type]);


  // Mutation for AI asset generation
  const generateAssetsMutation = useMutation({
    mutationFn: async ({ title, type }: { title: string; type: string }) => {
      const response = await apiRequest('POST', '/api/ai/generate-assets', { title, type });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setIsGeneratingAssets(false);
      toast({
        title: "Assets Generated",
        description: "AI has generated relevant assets for your content.",
      });
      // Update state with generated assets
      if (data.workflowImages) setWorkflowImages(data.workflowImages);
      if (data.mindmapImages) setMindmapImages(data.mindmapImages);
      if (data.generatedImages) setGeneratedImages(data.generatedImages);

      // Optionally, update form values if needed
      if (data.featuredImage) form.setValue("featuredImage", data.featuredImage);
      if (data.image) form.setValue("image", data.image);
    },
    onError: (error: Error) => {
      setIsGeneratingAssets(false);
      toast({
        title: "Error Generating Assets",
        description: error.message,
        variant: "destructive",
      });
    },
  });


  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Save mutation started with data:', data);

      const endpoint = getApiEndpoint();
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${endpoint}/${item.id}` : endpoint;

      console.log('API call details:', { method, url, endpoint });

      // Prepare data for submission, including flowchart data for roadmaps
      const submitData = {
        ...data,
        ...(type === 'roadmaps' && flowchartNodes.length > 0 ? {
          flowchartData: {
            nodes: flowchartNodes,
            edges: flowchartEdges,
          }
        } : type === 'roadmaps' ? {
          flowchartData: null
        } : {})
      };

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(submitData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText || 'Unknown error' };
          }
          console.error('API Error:', errorData);
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Save successful:', result);
        return result;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${type.replace('-', ' ').slice(0, -1)} ${isEditing ? 'updated' : 'created'} successfully`,
      });
      onSave();
    },
    onError: (error: Error) => {
      console.error('Save mutation error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getApiEndpoint = () => {
    switch (type) {
      case "jobs":
      case "fresher-jobs":
      case "internships":
        return "/api/jobs";
      case "articles":
        return "/api/articles";
      case "roadmaps":
        return "/api/roadmaps";
      case "dsa-corner":
        return "/api/dsa-problems";
      case "scholarships":
        return "/api/scholarships";
      default:
        return "/api/jobs";
    }
  };

  const onSubmit = (data: any) => {
    console.log('Form submission started with data:', data);

    // Validate required fields before submission
    const requiredFields = {
      jobs: ['title', 'company'],
      'fresher-jobs': ['title', 'company'],
      internships: ['title', 'company'],
      articles: ['title', 'content', 'author'],
      roadmaps: ['title', 'description'],
      'dsa-corner': ['title', 'difficulty', 'category']
    };

    const required = requiredFields[type as keyof typeof requiredFields] || [];

    for (const field of required) {
      if (!data[field] || data[field].toString().trim() === '') {
        toast({
          title: "Validation Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: "destructive",
        });
        return;
      }
    }

    // Prepare form data with all necessary fields
    let formData: any = {
      ...data,
      skills: skills || [],
      tags: tags || [],
      technologies: technologies || [],
      companies: companies || [],
      steps: steps || [],
      hints: hints || [],
      // Include AI-generated assets
      workflowImages: workflowImages || [],
      mindmapImages: mindmapImages || [],
      generatedImages: generatedImages || [],
    };

    // Type-specific data preparation
    if (type === "jobs" || type === "fresher-jobs" || type === "internships") {
      formData = {
        title: data.title,
        company: data.company,
        location: data.location || '',
        salaryRange: data.salaryRange || '',
        jobType: type === "internships" ? "internship" : data.jobType || "job",
        experienceLevel: type === "fresher-jobs" ? "fresher" : data.experienceLevel || "experienced",
        description: data.description || "Job description will be added soon",
        requirements: data.requirements || "Requirements will be added soon",
        responsibilities: data.responsibilities || '',
        benefits: data.benefits || '',
        companyWebsite: data.companyWebsite || '',
        applicationUrl: data.applicationUrl || '',
        sourceUrl: data.sourceUrl || '',
        companyLogo: companyLogoUrl || data.companyLogo || '',
        skills: skills,
        category: type === "fresher-jobs" ? "fresher-job" : type === "internships" ? "internship" : data.category || "job",
        isActive: data.isActive ?? true,
        expiresAt: data.expiresAt || undefined,
      };
    } else if (type === "articles") {
      formData = {
        title: data.title,
        content: data.content || "Article content will be added soon",
        excerpt: data.excerpt || '',
        author: data.author,
        category: data.category || '',
        tags: tags,
        isPublished: data.isPublished ?? true,
        readTime: data.readTime || 5,
        featuredImage: featuredImageUrl || data.featuredImage || '',
        expiresAt: data.expiresAt || undefined,
      };
    } else if (type === "roadmaps") {
      formData = {
        title: data.title,
        description: data.description,
        content: data.content || "Roadmap content will be added soon",
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime || '',
        technologies: technologies,
        steps: steps,
        flowchartData: flowchartNodes.length > 0 ? {
          nodes: flowchartNodes,
          edges: flowchartEdges,
        } : null,
        isPublished: data.isPublished ?? true,
        image: roadmapImageUrl || data.image || '',
      };
    } else if (type === "dsa-corner") {
      formData = {
        title: data.title,
        description: data.description || "Problem description will be added soon",
        difficulty: data.difficulty,
        category: data.category,
        solution: data.solution || "Solution will be added soon",
        hints: hints,
        timeComplexity: data.timeComplexity || '',
        spaceComplexity: data.spaceComplexity || '',
        tags: tags,
        companies: companies,
        isPublished: data.isPublished ?? true,
      };
    }

    console.log('Submitting form data:', formData);
    saveMutation.mutate(formData);
  };

  const addItem = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()]);
      inputSetter("");
    }
  };

  const removeItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_item: string, i: number) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, { title: "", description: "", resources: [] }]);
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleCompanyLogoUpload = async (file: File) => {
    setCompanyLogo(file);
    setIsUploadingImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setCompanyLogoUrl(url);
      form.setValue("companyLogo", url);
      toast({
        title: "Success",
        description: "Company logo uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload company logo",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFeaturedImageUpload = async (file: File) => {
    setUploadedImage(file);
    setIsUploadingImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setFeaturedImageUrl(url);
      form.setValue("featuredImage", url);
      toast({
        title: "Success",
        description: "Featured image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload featured image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRoadmapImageUpload = async (file: File) => {
    setUploadedImage(file);
    setIsUploadingImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setRoadmapImageUrl(url);
      form.setValue("image", url);
      toast({
        title: "Success",
        description: "Roadmap image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload roadmap image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFlowchartUpload = async (file: File) => {
    setFlowchartFile(file);
    
    if (file.type === 'application/json') {
      // Handle JSON file
      try {
        const text = await file.text();
        const flowchartData = JSON.parse(text);
        
        // Validate flowchart structure
        if (flowchartData.nodes && Array.isArray(flowchartData.nodes)) {
          setFlowchartNodes(flowchartData.nodes);
          setFlowchartEdges(flowchartData.edges || []);
          toast({
            title: "Success",
            description: "Flowchart JSON loaded successfully",
          });
        } else {
          throw new Error('Invalid flowchart JSON structure');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse flowchart JSON",
          variant: "destructive",
        });
      }
    } else if (file.type.startsWith('image/')) {
      // Handle image file
      setIsUploadingImage(true);
      try {
        const url = await uploadImageToCloudinary(file);
        setFlowchartImageUrl(url);
        toast({
          title: "Success",
          description: "Flowchart image uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload flowchart image",
          variant: "destructive",
        });
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const updateStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_step: RoadmapStep, i: number) => i !== index));
  };

  const renderJobFields = () => (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Job Title *</Label>
          <div className="flex gap-2">
            <Input 
              {...form.register("title")} 
              placeholder="e.g., Software Engineer Intern"
              data-testid="input-title"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                const title = form.watch("title");
                if (title) {
                  setIsGeneratingAssets(true);
                  generateAssetsMutation.mutate({ title, type });
                }
              }}
              disabled={!form.watch("title") || generateAssetsMutation.isPending || isGeneratingAssets}
              variant="outline"
              size="sm"
            >
              {generateAssetsMutation.isPending || isGeneratingAssets ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          {form.formState.errors.title && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.title?.message as string}</p>
          )}
        </div>
        <div>
          <Label htmlFor="company">Company Name *</Label>
          <Input 
            {...form.register("company")} 
            placeholder="e.g., Google"
            data-testid="input-company"
          />
          {form.formState.errors.company && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.company?.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input 
            {...form.register("location")} 
            placeholder="e.g., Bangalore"
            data-testid="input-location"
          />
        </div>
        <div>
          <Label htmlFor="salaryRange">Salary Range</Label>
          <Input 
            {...form.register("salaryRange")} 
            placeholder="e.g., ₹12-15 LPA"
            data-testid="input-salary-range"
          />
        </div>
        <div>
          <Label htmlFor="jobType">Job Type *</Label>
          <Select onValueChange={(value) => form.setValue("jobType", value)} defaultValue={form.getValues("jobType")}>
            <SelectTrigger data-testid="select-job-type">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job">Job</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="experienceLevel">Experience Level *</Label>
        <Select onValueChange={(value) => form.setValue("experienceLevel", value)} defaultValue={form.getValues("experienceLevel")}>
          <SelectTrigger data-testid="select-experience-level">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fresher">Fresher (0-2 years)</SelectItem>
            <SelectItem value="experienced">Experienced (2+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select onValueChange={(value) => form.setValue("category", value)} defaultValue={form.getValues("category")}>
          <SelectTrigger data-testid="select-category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="job">Job</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="fresher-job">Fresher Job</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Textarea 
          {...form.register("description")} 
          rows={8}
          placeholder="Enter detailed job description, requirements, and responsibilities..."
          className="resize-vertical"
          data-testid="textarea-description"
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements *</Label>
        <Textarea 
          {...form.register("requirements")} 
          rows={6}
          placeholder="List the key requirements and qualifications..."
          className="resize-vertical"
          data-testid="textarea-requirements"
        />
      </div>

      <div>
        <Label htmlFor="responsibilities">Responsibilities</Label>
        <Textarea 
          {...form.register("responsibilities")} 
          rows={4}
          placeholder="List job responsibilities..."
          className="resize-vertical"
          data-testid="textarea-responsibilities"
        />
      </div>

      <div>
        <Label htmlFor="benefits">Benefits</Label>
        <Textarea 
          {...form.register("benefits")} 
          rows={3}
          placeholder="List company benefits and perks..."
          className="resize-vertical"
          data-testid="textarea-benefits"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="companyWebsite">Company Website</Label>
          <Input 
            {...form.register("companyWebsite")} 
            placeholder="https://company.com"
            data-testid="input-company-website"
          />
        </div>
        <div>
          <Label htmlFor="applicationUrl">Application URL *</Label>
          <Input 
            {...form.register("applicationUrl")} 
            placeholder="https://company.com/careers/job-id"
            data-testid="input-application-url"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="sourceUrl">Source URL</Label>
        <Input 
          {...form.register("sourceUrl")} 
          placeholder="https://source-website.com/job-posting"
          data-testid="input-source-url"
        />
      </div>

      <div>
        <Label>Company Logo</Label>
        <FileUpload
          onFileSelect={handleCompanyLogoUpload}
          acceptedTypes={['.jpg', '.jpeg', '.png', '.svg']}
          maxSize={2 * 1024 * 1024} // 2MB
          data-testid="company-logo-upload"
        />
        {isUploadingImage && (
          <p className="text-sm text-muted-foreground mt-2">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            Uploading...
          </p>
        )}
        {companyLogoUrl && (
          <div className="mt-2">
            <img src={companyLogoUrl} alt="Company logo preview" className="w-20 h-20 object-contain border rounded" />
            <p className="text-sm text-muted-foreground">Uploaded successfully</p>
          </div>
        )}
      </div>

      <div>
        <Label>Skills Required</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(skillInput, setSkills, setSkillInput))}
            data-testid="input-skill"
          />
          <Button 
            type="button" 
            onClick={() => addItem(skillInput, setSkills, setSkillInput)}
            data-testid="button-add-skill"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1" data-testid={`skill-badge-${index}`}>
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index, setSkills)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={form.watch("isActive")}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
          data-testid="switch-active"
        />
        <Label>Active Job Posting</Label>
      </div>

      <div>
        <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
        <Input 
          {...form.register("expiresAt")} 
          type="datetime-local"
          placeholder="Select expiration date"
          data-testid="input-expires-at"
        />
        <p className="text-sm text-muted-foreground mt-1">
          This job will be automatically deleted after the expiration date
        </p>
      </div>

      {/* Display AI-generated images */}
      {(workflowImages.length > 0 || mindmapImages.length > 0 || generatedImages.length > 0) && (
        <div className="space-y-4">
          <Label>AI Generated Assets</Label>
          {workflowImages.length > 0 && (
            <div>
              <Label>Workflow Images</Label>
              <div className="flex flex-wrap gap-2">
                {workflowImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Workflow ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {mindmapImages.length > 0 && (
            <div>
              <Label>Mindmap Images</Label>
              <div className="flex flex-wrap gap-2">
                {mindmapImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Mindmap ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {generatedImages.length > 0 && (
            <div>
              <Label>Generated Images</Label>
              <div className="flex flex-wrap gap-2">
                {generatedImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Generated ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderArticleFields = () => (
    <>
      <div>
        <Label htmlFor="title">Article Title *</Label>
        <div className="flex gap-2">
          <Input 
            {...form.register("title")} 
            placeholder="Enter article title"
            data-testid="input-title"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => {
              const title = form.watch("title");
              if (title) {
                setIsGeneratingAssets(true);
                generateAssetsMutation.mutate({ title, type });
              }
            }}
            disabled={!form.watch("title") || generateAssetsMutation.isPending || isGeneratingAssets}
            variant="outline"
            size="sm"
          >
            {generateAssetsMutation.isPending || isGeneratingAssets ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.title && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.title?.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Textarea 
          {...form.register("excerpt")} 
          rows={3}
          placeholder="Brief description of the article"
          data-testid="textarea-excerpt"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="author">Author *</Label>
          <Input 
            {...form.register("author")} 
            placeholder="Author name"
            data-testid="input-author"
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input 
            {...form.register("category")} 
            placeholder="e.g., Technology, Career"
            data-testid="input-category"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea 
          {...form.register("content")} 
          rows={15}
          placeholder="Write your article content in Markdown format..."
          className="resize-vertical"
          data-testid="textarea-content"
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(tagInput, setTags, setTagInput))}
            data-testid="input-tag"
          />
          <Button 
            type="button" 
            onClick={() => addItem(tagInput, setTags, setTagInput)}
            data-testid="button-add-tag"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1" data-testid={`tag-badge-${index}`}>
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index, setTags)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Featured Image</Label>
        <FileUpload
          onFileSelect={handleFeaturedImageUpload}
          acceptedTypes={['.jpg', '.jpeg', '.png']}
          maxSize={5 * 1024 * 1024} // 5MB
          data-testid="featured-image-upload"
        />
        {isUploadingImage && (
          <p className="text-sm text-muted-foreground mt-2">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            Uploading...
          </p>
        )}
        {featuredImageUrl && (
          <div className="mt-2">
            <img src={featuredImageUrl} alt="Featured image preview" className="w-40 h-24 object-cover border rounded" />
            <p className="text-sm text-muted-foreground">Uploaded successfully</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="readTime">Read Time (minutes)</Label>
          <Input 
            {...form.register("readTime", { valueAsNumber: true })} 
            type="number"
            placeholder="5"
            data-testid="input-read-time"
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch 
            checked={form.watch("isPublished")}
            onCheckedChange={(checked) => form.setValue("isPublished", checked)}
            data-testid="switch-published"
          />
          <Label>Published</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
        <Input 
          {...form.register("expiresAt")} 
          type="datetime-local"
          placeholder="Select expiration date"
          data-testid="input-expires-at"
        />
        <p className="text-sm text-muted-foreground mt-1">
          This article will be automatically deleted after the expiration date
        </p>
      </div>

      {/* Display AI-generated images */}
      {(workflowImages.length > 0 || mindmapImages.length > 0 || generatedImages.length > 0) && (
        <div className="space-y-4">
          <Label>AI Generated Assets</Label>
          {workflowImages.length > 0 && (
            <div>
              <Label>Workflow Images</Label>
              <div className="flex flex-wrap gap-2">
                {workflowImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Workflow ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {mindmapImages.length > 0 && (
            <div>
              <Label>Mindmap Images</Label>
              <div className="flex flex-wrap gap-2">
                {mindmapImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Mindmap ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {generatedImages.length > 0 && (
            <div>
              <Label>Generated Images</Label>
              <div className="flex flex-wrap gap-2">
                {generatedImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Generated ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderRoadmapFields = () => (
    <>
      <div>
        <Label htmlFor="title">Roadmap Title *</Label>
        <div className="flex gap-2">
          <Input 
            {...form.register("title")} 
            placeholder="e.g., Frontend Developer Roadmap"
            data-testid="input-title"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => {
              const title = form.watch("title");
              if (title) {
                setIsGeneratingAssets(true);
                generateAssetsMutation.mutate({ title, type });
              }
            }}
            disabled={!form.watch("title") || generateAssetsMutation.isPending || isGeneratingAssets}
            variant="outline"
            size="sm"
          >
            {generateAssetsMutation.isPending || isGeneratingAssets ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.title && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.title?.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          {...form.register("description")} 
          rows={4}
          placeholder="Brief description of the roadmap"
          data-testid="textarea-description"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="difficulty">Difficulty *</Label>
          <Select onValueChange={(value) => form.setValue("difficulty", value)} defaultValue={form.getValues("difficulty")}>
            <SelectTrigger data-testid="select-difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="educationLevel">Education Level *</Label>
          <Select onValueChange={(value) => form.setValue("educationLevel", value)} defaultValue={form.getValues("educationLevel") || "btech"}>
            <SelectTrigger data-testid="select-education-level">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upto-10th">Upto 10th Class</SelectItem>
              <SelectItem value="12th">12th Pass/Pursuing</SelectItem>
              <SelectItem value="btech">B.Tech/Engineering</SelectItem>
              <SelectItem value="degree">Degree/Graduation</SelectItem>
              <SelectItem value="postgrad">Post Graduation</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="estimatedTime">Estimated Time</Label>
          <Input 
            {...form.register("estimatedTime")} 
            placeholder="e.g., 3-6 months"
            data-testid="input-estimated-time"
          />
        </div>
      </div>

      <div>
        <Label>Technologies</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={technologyInput}
            onChange={(e) => setTechnologyInput(e.target.value)}
            placeholder="Add a technology"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(technologyInput, setTechnologies, setTechnologyInput))}
            data-testid="input-technology"
          />
          <Button 
            type="button" 
            onClick={() => addItem(technologyInput, setTechnologies, setTechnologyInput)}
            data-testid="button-add-technology"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1" data-testid={`technology-badge-${index}`}>
              {tech}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index, setTechnologies)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea 
          {...form.register("content")} 
          rows={10}
          placeholder="Write the roadmap content in Markdown format..."
          className="resize-vertical"
          data-testid="textarea-content"
        />
      </div>

      <div>
        <Label>Roadmap Image</Label>
        <FileUpload
          onFileSelect={handleRoadmapImageUpload}
          acceptedTypes={['.jpg', '.jpeg', '.png']}
          maxSize={5 * 1024 * 1024} // 5MB
          data-testid="roadmap-image-upload"
        />
        {isUploadingImage && (
          <p className="text-sm text-muted-foreground mt-2">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            Uploading...
          </p>
        )}
        {roadmapImageUrl && (
          <div className="mt-2">
            <img src={roadmapImageUrl} alt="Roadmap image preview" className="w-40 h-24 object-cover border rounded" />
            <p className="text-sm text-muted-foreground">Uploaded successfully</p>
          </div>
        )}
      </div>

      {/* Flowchart Upload */}
      <div>
        <Label>Upload Flowchart (JSON or Image)</Label>
        <FileUpload
          onFileSelect={handleFlowchartUpload}
          acceptedTypes={['.json', '.jpg', '.jpeg', '.png']}
          maxSize={5 * 1024 * 1024} // 5MB
          data-testid="flowchart-upload"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Upload a JSON file with flowchart data (nodes and edges) or an image of your flowchart
        </p>
        {isUploadingImage && (
          <p className="text-sm text-muted-foreground mt-2">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            Uploading flowchart...
          </p>
        )}
        {flowchartFile && flowchartFile.type === 'application/json' && (
          <div className="mt-2">
            <p className="text-sm text-green-600">
              ✓ Flowchart JSON loaded: {flowchartNodes.length} nodes, {flowchartEdges.length} edges
            </p>
          </div>
        )}
        {flowchartImageUrl && (
          <div className="mt-2">
            <img src={flowchartImageUrl} alt="Flowchart preview" className="w-full max-w-md border rounded" />
            <p className="text-sm text-muted-foreground">Flowchart image uploaded successfully</p>
          </div>
        )}
      </div>

      {/* Flowchart Editor for Roadmaps */}
      <div className="space-y-4">
        <Label>Interactive Flowchart Editor</Label>
        <p className="text-xs text-muted-foreground">
          Create or edit your flowchart visually. You can also upload a JSON file above.
        </p>
        <FlowchartEditor
          initialNodes={flowchartNodes}
          initialEdges={flowchartEdges}
          roadmapData={{
            title: form.watch('title') || '',
            description: form.watch('description') || '',
            technologies: technologies,
            difficulty: form.watch('difficulty') || 'intermediate'
          }}
          onSave={(nodes, edges) => {
            setFlowchartNodes(nodes);
            setFlowchartEdges(edges);
          }}
        />
        {flowchartNodes.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Flowchart configured with {flowchartNodes.length} nodes and {flowchartEdges.length} connections
          </p>
        )}
      </div>

      <div>
        <Label>Learning Steps</Label>
        <div className="space-y-4">
          {steps.map((step: RoadmapStep, index: number) => (
            <Card key={index} className="p-4" data-testid={`step-${index}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Step {index + 1}</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeStep(index)}
                    data-testid={`button-remove-step-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input 
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder="Step title"
                  data-testid={`input-step-title-${index}`}
                />
                <Textarea 
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="Step description"
                  rows={3}
                  data-testid={`textarea-step-description-${index}`}
                />
              </div>
            </Card>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={addStep}
            data-testid="button-add-step"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={form.watch("isPublished")}
          onCheckedChange={(checked) => form.setValue("isPublished", checked)}
          data-testid="switch-published"
        />
        <Label>Published</Label>
      </div>

      {/* Display AI-generated images */}
      {(workflowImages.length > 0 || mindmapImages.length > 0 || generatedImages.length > 0) && (
        <div className="space-y-4">
          <Label>AI Generated Assets</Label>
          {workflowImages.length > 0 && (
            <div>
              <Label>Workflow Images</Label>
              <div className="flex flex-wrap gap-2">
                {workflowImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Workflow ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {mindmapImages.length > 0 && (
            <div>
              <Label>Mindmap Images</Label>
              <div className="flex flex-wrap gap-2">
                {mindmapImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Mindmap ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {generatedImages.length > 0 && (
            <div>
              <Label>Generated Images</Label>
              <div className="flex flex-wrap gap-2">
                {generatedImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Generated ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderDsaFields = () => (
    <>
      <div>
        <Label htmlFor="title">Problem Title *</Label>
        <div className="flex gap-2">
          <Input 
            {...form.register("title")} 
            placeholder="e.g., Two Sum"
            data-testid="input-title"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => {
              const title = form.watch("title");
              if (title) {
                setIsGeneratingAssets(true);
                generateAssetsMutation.mutate({ title, type });
              }
            }}
            disabled={!form.watch("title") || generateAssetsMutation.isPending || isGeneratingAssets}
            variant="outline"
            size="sm"
          >
            {generateAssetsMutation.isPending || isGeneratingAssets ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.title && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.title?.message as string}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="difficulty">Difficulty *</Label>
          <Select onValueChange={(value) => form.setValue("difficulty", value)} defaultValue={form.getValues("difficulty")}>
            <SelectTrigger data-testid="select-difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input 
            {...form.register("category")} 
            placeholder="e.g., Array, String, Tree"
            data-testid="input-category"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Problem Description *</Label>
        <Textarea 
          {...form.register("description")} 
          rows={8}
          placeholder="Describe the problem statement..."
          className="resize-vertical"
          data-testid="textarea-description"
        />
      </div>

      <div>
        <Label htmlFor="solution">Solution *</Label>
        <Textarea 
          {...form.register("solution")} 
          rows={10}
          placeholder="Provide the solution with code examples..."
          className="resize-vertical"
          data-testid="textarea-solution"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="timeComplexity">Time Complexity</Label>
          <Input 
            {...form.register("timeComplexity")} 
            placeholder="e.g., O(n)"
            data-testid="input-time-complexity"
          />
        </div>
        <div>
          <Label htmlFor="spaceComplexity">Space Complexity</Label>
          <Input 
            {...form.register("spaceComplexity")} 
            placeholder="e.g., O(1)"
            data-testid="input-space-complexity"
          />
        </div>
      </div>

      <div>
        <Label>Hints</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={hintInput}
            onChange={(e) => setHintInput(e.target.value)}
            placeholder="Add a hint"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(hintInput, setHints, setHintInput))}
            data-testid="input-hint"
          />
          <Button 
            type="button" 
            onClick={() => addItem(hintInput, setHints, setHintInput)}
            data-testid="button-add-hint"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hints.map((hint, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1" data-testid={`hint-badge-${index}`}>
              {hint}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index, setHints)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Companies</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            placeholder="Add a company"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(companyInput, setCompanies, setCompanyInput))}
            data-testid="input-company"
          />
          <Button 
            type="button" 
            onClick={() => addItem(companyInput, setCompanies, setCompanyInput)}
            data-testid="button-add-company"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {companies.map((company, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1" data-testid={`company-badge-${index}`}>
              {company}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index, setCompanies)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(tagInput, setTags, setTagInput))}
            data-testid="input-tag"
          />
          <Button 
            type="button" 
            onClick={() => addItem(tagInput, setTags, setTagInput)}
            data-testid="button-add-tag"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1" data-testid={`tag-badge-${index}`}>
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index, setTags)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={form.watch("isPublished")}
          onCheckedChange={(checked) => form.setValue("isPublished", checked)}
          data-testid="switch-published"
        />
        <Label>Published</Label>
      </div>

      {/* Display AI-generated images */}
      {(workflowImages.length > 0 || mindmapImages.length > 0 || generatedImages.length > 0) && (
        <div className="space-y-4">
          <Label>AI Generated Assets</Label>
          {workflowImages.length > 0 && (
            <div>
              <Label>Workflow Images</Label>
              <div className="flex flex-wrap gap-2">
                {workflowImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Workflow ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {mindmapImages.length > 0 && (
            <div>
              <Label>Mindmap Images</Label>
              <div className="flex flex-wrap gap-2">
                {mindmapImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Mindmap ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          {generatedImages.length > 0 && (
            <div>
              <Label>Generated Images</Label>
              <div className="flex flex-wrap gap-2">
                {generatedImages.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Generated ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderScholarshipFields = () => (
    <>
      <div>
        <Label htmlFor="title">Scholarship Title *</Label>
        <Input 
          {...form.register("title")} 
          placeholder="e.g., National Merit Scholarship"
          data-testid="input-title"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="provider">Provider *</Label>
          <Input 
            {...form.register("provider")} 
            placeholder="e.g., Government of India"
            data-testid="input-provider"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount *</Label>
          <Input 
            {...form.register("amount")} 
            placeholder="e.g., ₹50,000 per year"
            data-testid="input-amount"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="educationLevel">Education Level *</Label>
          <Select onValueChange={(value) => form.setValue("educationLevel", value)} defaultValue={form.getValues("educationLevel")}>
            <SelectTrigger data-testid="select-education-level">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upto-10th">Upto 10th Class</SelectItem>
              <SelectItem value="12th">12th Pass/Pursuing</SelectItem>
              <SelectItem value="btech">B.Tech/Engineering</SelectItem>
              <SelectItem value="degree">Degree/Graduation</SelectItem>
              <SelectItem value="postgrad">Post Graduation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => form.setValue("category", value)} defaultValue={form.getValues("category")}>
            <SelectTrigger data-testid="select-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="merit">Merit Based</SelectItem>
              <SelectItem value="need">Need Based</SelectItem>
              <SelectItem value="minority">Minority</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="government">Government</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          {...form.register("description")} 
          rows={4}
          placeholder="Brief description of the scholarship"
          data-testid="textarea-description"
        />
      </div>

      <div>
        <Label htmlFor="eligibility">Eligibility Criteria *</Label>
        <Textarea 
          {...form.register("eligibility")} 
          rows={5}
          placeholder="List eligibility requirements..."
          data-testid="textarea-eligibility"
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea 
          {...form.register("requirements")} 
          rows={4}
          placeholder="Documents and requirements needed..."
          data-testid="textarea-requirements"
        />
      </div>

      <div>
        <Label htmlFor="benefits">Benefits</Label>
        <Textarea 
          {...form.register("benefits")} 
          rows={3}
          placeholder="Additional benefits provided..."
          data-testid="textarea-benefits"
        />
      </div>

      <div>
        <Label htmlFor="howToApply">How to Apply</Label>
        <Textarea 
          {...form.register("howToApply")} 
          rows={4}
          placeholder="Step-by-step application process..."
          data-testid="textarea-how-to-apply"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input 
            {...form.register("deadline")} 
            type="datetime-local"
            data-testid="input-deadline"
          />
        </div>
        <div>
          <Label htmlFor="applicationUrl">Application URL</Label>
          <Input 
            {...form.register("applicationUrl")} 
            placeholder="https://scholarship-portal.com/apply"
            data-testid="input-application-url"
          />
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(tagInput, setTags, setTagInput))}
            data-testid="input-tag"
          />
          <Button 
            type="button" 
            onClick={() => addItem(tagInput, setTags, setTagInput)}
            data-testid="button-add-tag"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1" data-testid={`tag-badge-${index}`}>
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeItem(index, setTags)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={form.watch("isActive")}
            onCheckedChange={(checked) => form.setValue("isActive", checked)}
            data-testid="switch-active"
          />
          <Label>Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={form.watch("featured")}
            onCheckedChange={(checked) => form.setValue("featured", checked)}
            data-testid="switch-featured"
          />
          <Label>Featured</Label>
        </div>
      </div>
    </>
  );

  const renderFields = () => {
    switch (type) {
      case "jobs":
      case "fresher-jobs":
      case "internships":
        return renderJobFields();
      case "articles":
        return renderArticleFields();
      case "roadmaps":
        return renderRoadmapFields();
      case "dsa-corner":
        return renderDsaFields();
      case "scholarships":
        return renderScholarshipFields();
      default:
        return renderJobFields();
    }
  };

  return (
    <Card data-testid="content-form">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl capitalize" data-testid="form-title">
          {isEditing ? `Edit ${type.replace('-', ' ').slice(0, -1)}` : `Add New ${type.replace('-', ' ').slice(0, -1)}`}
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderFields()}

          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              data-testid="button-cancel-bottom"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending || isGeneratingAssets}
              data-testid="button-save"
            >
              {saveMutation.isPending || isGeneratingAssets ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isGeneratingAssets ? "Generating Assets..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}