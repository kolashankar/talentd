import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  Check,
  Palette,
  Zap,
  Sparkles,
  Globe,
  Code,
  Layers,
  Box,
  Monitor,
  Gem,
  Rocket,
  Wand2,
  Loader2,
  X
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { TemplatePreview } from './template-preview';

export interface PortfolioTemplate {
  id: string;
  templateId: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  thumbnailUrl?: string;
  isPremium: boolean;
  isActive: boolean;
}

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  onTemplateSelect: (template: PortfolioTemplate) => void;
  onClose: () => void;
}

const categoryIcons: Record<string, any> = {
  modern: Gem,
  creative: Palette,
  minimal: Monitor,
  "3d": Box,
  animated: Sparkles,
  default: Code
};

export function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
  onClose,
}: TemplateSelectorProps) {
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery<{ templates: PortfolioTemplate[] }>({
    queryKey: ['/api/templates'],
  });

  const templates = data?.templates || [];
  
  const filteredTemplates =
    filter === "all"
      ? templates
      : templates.filter((t) => t.category === filter);

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center" data-testid="template-selector-loading">
        <Card className="w-full max-w-4xl mx-4">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center" data-testid="template-selector-error">
        <Card className="w-full max-w-4xl mx-4">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <p className="text-destructive">Failed to load templates</p>
              <Button onClick={onClose} data-testid="button-close-error">Close</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="template-selector-modal">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold" data-testid="text-template-selector-title">Choose Your Template</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select a professional template for your portfolio
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-template-selector"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilter(category)}
                  data-testid={`filter-${category}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              ))}
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No templates available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Contact admin to upload templates
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplatePreview
                    key={template.templateId || template.id}
                    template={{
                      id: template.templateId || template.id,
                      name: template.name,
                      description: template.description || '',
                      thumbnail: template.thumbnailUrl,
                      features: template.features || [],
                      category: template.category,
                      isPremium: template.isPremium,
                    }}
                    isSelected={selectedTemplate === (template.templateId || template.id)}
                    onClick={() => onTemplateSelect(template)}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-template-selection"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const selected = templates.find(t => (t.templateId || t.id) === selectedTemplate);
                if (selected) {
                  onTemplateSelect(selected);
                }
              }}
              disabled={!selectedTemplate}
              data-testid="button-confirm-template-selection"
            >
              Continue with Selected
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
