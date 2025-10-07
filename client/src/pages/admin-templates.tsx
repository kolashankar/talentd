import { useState } from "react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Download,
  FileCode,
  Loader2,
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface Template {
  id: number;
  templateId: string;
  name: string;
  description?: string;
  version: string;
  category: string;
  thumbnailUrl?: string;
  features: string[];
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTemplatesPage() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const { data: templatesData, isLoading } = useQuery<{ database: Template[]; registry: any }>({
    queryKey: ['/api/admin/templates'],
    retry: false,
  });

  const uploadMutation = useMutation({
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
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Template uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
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

  const toggleMutation = useMutation({
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const templates = templatesData?.database || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold" data-testid="heading-admin-templates">
              Template Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Upload and manage portfolio templates
            </p>
          </div>

          <div>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              className="hidden"
              id="template-upload"
              disabled={uploading}
            />
            <label htmlFor="template-upload">
              <Button
                asChild
                disabled={uploading}
                data-testid="button-upload-template"
              >
                <span className="cursor-pointer">
                  {uploading ? (
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
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Template Structure Guidelines */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCode className="mr-2 h-5 w-5" />
              Template Structure Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Required Files:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>manifest.json (template metadata)</li>
                  <li>index.tsx (main entry component)</li>
                  <li>thumbnail.png (optional preview image)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Template Structure Example:</h3>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`template-name.zip
├── manifest.json          # Template metadata
├── index.tsx             # Main template component
├── thumbnail.png         # Preview image
├── components/           # Reusable components
│   ├── Hero.tsx
│   ├── Projects.tsx
│   └── Contact.tsx
├── assets/              # Images, fonts, etc.
│   └── images/
├── styles/              # CSS/styling files
│   └── custom.css
└── data/               # Data structures
    └── portfolio-data.ts`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">manifest.json Example:</h3>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "id": "modern-glass",
  "name": "Glass Morphism",
  "version": "1.0.0",
  "description": "Modern glassmorphism design",
  "category": "modern",
  "entryFile": "index.tsx",
  "thumbnail": "thumbnail.png",
  "features": ["3D Animations", "Glass Effects"],
  "isPremium": false,
  "config": {
    "supportsEmailJS": true,
    "supportsThemes": true,
    "supportsAnimations": true
  }
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Component Template (index.tsx):</h3>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
{`import { TemplateProps } from '@shared/template-types';
import { ContactForm, Section } from '../shared/components';

export default function MyTemplate({ data, theme }: TemplateProps) {
  return (
    <div>
      <h1>{data.personal.name}</h1>
      <p>{data.personal.title}</p>
      {/* Your template design here */}
      <ContactForm userEmail={data.personal.email} />
    </div>
  );
}`}
                </pre>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open('/templates/modern-minimal/manifest.json', '_blank');
                  }}
                  data-testid="button-view-example"
                >
                  <Download className="mr-2 h-4 w-4" />
                  View Example Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-templates">
            <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No templates uploaded</h3>
            <p className="text-muted-foreground">
              Upload your first template to get started
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: Template) => (
              <Card key={template.id} data-testid={`template-card-${template.templateId}`}>
                <CardContent className="p-0">
                  {template.thumbnailUrl && (
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>v{template.version}</span>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>

                    {template.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/templates/${template.templateId}/index.tsx`, '_blank')}
                        title="Preview Template"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleMutation.mutate(template.templateId)}
                        data-testid={`button-toggle-${template.templateId}`}
                        title={template.isActive ? "Deactivate" : "Activate"}
                      >
                        {template.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const link = document.createElement('a');
                          link.href = `/templates/${template.templateId}.zip`;
                          link.download = `${template.templateId}.zip`;
                          link.click();
                        }}
                        title="Download Template"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this template?')) {
                            deleteMutation.mutate(template.templateId);
                          }
                        }}
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
      </div>
    </div>
  );
}