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
import { 
  insertJobSchema, 
  insertArticleSchema, 
  insertRoadmapSchema, 
  insertDsaProblemSchema 
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
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
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

  useEffect(() => {
    if (item) {
      setSkills(item.skills || []);
      setTags(item.tags || []);
      setTechnologies(item.technologies || []);
      setCompanies(item.companies || []);
      setSteps(item.steps || []);
      setHints(item.hints || []);

      // Handle AI-generated visual content
      setWorkflowImages(item.workflowImages || []);
      setMindmapImages(item.mindmapImages || []);
      setGeneratedImages(item.generatedImages || []);

      // Update form values with AI-generated content
      Object.keys(item).forEach(key => {
        if (item[key] !== undefined && item[key] !== null) {
          form.setValue(key as any, item[key]);
        }
      });

      // Auto-fill AI generated content with visual feedback
      if (item.isAIGenerated) {
        toast({
          title: "AI Content Loaded",
          description: "Content has been auto-filled with AI-generated data including images and visuals.",
        });
      }
    }
  }, [item, form]);

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
      const endpoint = getApiEndpoint();
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${endpoint}/${item.id}` : endpoint;

      // Ensure AI-generated assets are included in the data sent for saving
      const payload = {
        ...data,
        skills,
        tags,
        technologies,
        companies,
        steps,
        hints,
        workflowImages,
        mindmapImages,
        generatedImages,
        // Add placeholder URLs for images (in a real app, you'd upload to a file service)
        featuredImage: uploadedImage ? `https://placeholder.com/600x400/${uploadedImage.name}` : data.featuredImage,
        companyLogo: companyLogo ? `https://placeholder.com/200x200/${companyLogo.name}` : data.companyLogo,
        image: uploadedImage ? `https://placeholder.com/600x400/${uploadedImage.name}` : data.image,
      };

      return await apiRequest(method, url, payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${type.slice(0, -1)} ${isEditing ? 'updated' : 'created'} successfully`,
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
      default:
        return "/api/jobs";
    }
  };

  const onSubmit = (data: any) => {
    // Validate required fields before submission
    const requiredFields = {
      jobs: ['title', 'company', 'description', 'requirements'],
      articles: ['title', 'excerpt', 'author', 'content'],
      roadmaps: ['title', 'description', 'difficulty'],
      'dsa-corner': ['title', 'difficulty', 'category', 'description', 'solution']
    };

    const currentType = type === "fresher-jobs" || type === "internships" ? "jobs" : type;
    const required = requiredFields[currentType as keyof typeof requiredFields] || [];
    
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

    // Ensure required fields are present
    const formData = {
      ...data,
      skills,
      tags,
      technologies,
      companies,
      steps,
      hints,
      // Ensure category is set properly
      category: type === "fresher-jobs" ? "fresher-job" : type === "internships" ? "internship" : data.category || "job",
      // Add placeholder URLs for images (in a real app, you'd upload to a file service)
      featuredImage: uploadedImage ? `https://placeholder.com/600x400/${uploadedImage.name}` : data.featuredImage,
      companyLogo: companyLogo ? `https://placeholder.com/200x200/${companyLogo.name}` : data.companyLogo,
      image: uploadedImage ? `https://placeholder.com/600x400/${uploadedImage.name}` : data.image,
      // Include AI-generated assets in the form data
      workflowImages,
      mindmapImages,
      generatedImages,
      // Ensure boolean fields have proper defaults
      isActive: data.isActive ?? true,
      isPublished: data.isPublished ?? true,
      // Ensure createdAt is set for new items
      createdAt: isEditing ? data.createdAt : new Date().toISOString(),
    };

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
    setter(prev => prev.filter((_: any, i: number) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, { title: "", description: "", resources: [] }]);
  };

  const updateStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
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
            <p className="text-sm text-destructive mt-1">{form.formState.errors.title?.message}</p>
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
            <p className="text-sm text-destructive mt-1">{form.formState.errors.company?.message}</p>
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
          onFileSelect={setCompanyLogo}
          acceptedTypes={['.jpg', '.jpeg', '.png', '.svg']}
          maxSize={2 * 1024 * 1024} // 2MB
          data-testid="company-logo-upload"
        />
        {companyLogo && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {companyLogo.name}
          </p>
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
          onFileSelect={setUploadedImage}
          acceptedTypes={['.jpg', '.jpeg', '.png']}
          maxSize={5 * 1024 * 1024} // 5MB
          data-testid="featured-image-upload"
        />
        {uploadedImage && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {uploadedImage.name}
          </p>
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

      <div className="grid md:grid-cols-2 gap-6">
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
          onFileSelect={setUploadedImage}
          acceptedTypes={['.jpg', '.jpeg', '.png']}
          maxSize={5 * 1024 * 1024} // 5MB
          data-testid="roadmap-image-upload"
        />
        {uploadedImage && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {uploadedImage.name}
          </p>
        )}
      </div>

      <div>
        <Label>Learning Steps</Label>
        <div className="space-y-4">
          {steps.map((step, index) => (
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