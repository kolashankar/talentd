
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    features: string[];
    category: string;
    isPremium: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function TemplatePreview({ template, isSelected, onClick }: TemplatePreviewProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
      data-testid={`template-preview-${template.id}`}
    >
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative h-48 bg-muted">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Preview
            </div>
          )}
          
          {isSelected && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}

          {template.isPremium && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              Premium
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <Badge variant="outline" className="text-xs">
              {template.category}
            </Badge>
          </div>

          {template.description && (
            <p className="text-sm text-muted-foreground mb-3">
              {template.description}
            </p>
          )}

          {template.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.features.slice(0, 3).map((feature, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {template.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.features.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
