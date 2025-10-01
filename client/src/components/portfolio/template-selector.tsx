
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Smartphone,
  Star,
  Crown,
  Gem,
  Rocket,
  Wand2
} from "lucide-react";

export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "modern" | "creative" | "minimal" | "3d" | "animated";
  features: string[];
  icon: React.ComponentType<any>;
  isPremium?: boolean;
  previewUrl?: string;
  thumbnailUrl: string;
}

const templates: PortfolioTemplate[] = [
  {
    id: "modern-glass",
    name: "Glass Morphism",
    description: "Modern glassmorphism design with blur effects and 3D elements",
    preview: "A sleek portfolio with glass-like transparent cards and smooth animations",
    category: "modern",
    features: ["3D Animations", "Glass Effects", "Smooth Scrolling", "Dark/Light Mode"],
    icon: Gem,
    thumbnailUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    isPremium: true
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    description: "Futuristic cyberpunk theme with neon animations and 3D effects",
    preview: "High-tech portfolio with glowing elements and matrix-style animations",
    category: "3d",
    features: ["Neon Effects", "3D Rotations", "Particle Animations", "Cyber Theme"],
    icon: Zap,
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    isPremium: true
  },
  {
    id: "floating-elements",
    name: "Floating Elements",
    description: "3D floating cards with physics-based animations",
    preview: "Interactive portfolio with floating 3D elements that respond to mouse movement",
    category: "3d",
    features: ["3D Physics", "Mouse Interactions", "Floating Cards", "Depth Effects"],
    icon: Box,
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop"
  },
  {
    id: "particle-galaxy",
    name: "Particle Galaxy",
    description: "Space-themed portfolio with particle systems and cosmic animations",
    preview: "Stunning galaxy background with animated particles and constellation effects",
    category: "animated",
    features: ["Particle Systems", "Space Theme", "Constellation Effects", "Cosmic Animations"],
    icon: Sparkles,
    thumbnailUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop"
  },
  {
    id: "minimal-swiss",
    name: "Swiss Minimal",
    description: "Clean Swiss design with subtle micro-interactions",
    preview: "Elegant minimalist design focused on typography and whitespace",
    category: "minimal",
    features: ["Clean Typography", "Micro-interactions", "Grid Layout", "Responsive"],
    icon: Monitor,
    thumbnailUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop"
  },
  {
    id: "creative-portfolio",
    name: "Creative Studio",
    description: "Bold creative design with animated illustrations",
    preview: "Vibrant portfolio perfect for designers and creative professionals",
    category: "creative",
    features: ["Custom Illustrations", "Bold Colors", "Creative Layouts", "Animation"],
    icon: Palette,
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
  },
  {
    id: "holographic-3d",
    name: "Holographic 3D",
    description: "Holographic effects with rotating 3D models and iridescent colors",
    preview: "Next-gen portfolio with holographic elements and 3D model integration",
    category: "3d",
    features: ["Holographic Effects", "3D Models", "Iridescent Colors", "WebGL"],
    icon: Crown,
    thumbnailUrl: "https://images.unsplash.com/photo-1617791160588-241658c0f566?w=400&h=300&fit=crop",
    isPremium: true
  },
  {
    id: "morphing-shapes",
    name: "Morphing Shapes",
    description: "Dynamic portfolio with morphing geometric shapes and fluid animations",
    preview: "Interactive shapes that transform and morph as you scroll",
    category: "animated",
    features: ["Morphing Animations", "Geometric Shapes", "Fluid Motion", "SVG Animations"],
    icon: Layers,
    thumbnailUrl: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop"
  },
  {
    id: "terminal-hacker",
    name: "Terminal Hacker",
    description: "Developer-focused design with terminal aesthetics and code animations",
    preview: "Perfect for developers with terminal-style interface and typing animations",
    category: "modern",
    features: ["Terminal Theme", "Code Animations", "Matrix Effects", "Developer Focus"],
    icon: Code,
    thumbnailUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop"
  },
  {
    id: "liquid-motion",
    name: "Liquid Motion",
    description: "Fluid liquid animations with blob morphing and wave effects",
    preview: "Organic portfolio design with liquid animations and blob shapes",
    category: "animated",
    features: ["Liquid Animations", "Blob Morphing", "Wave Effects", "Organic Shapes"],
    icon: Globe,
    thumbnailUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=300&fit=crop"
  },
  {
    id: "retro-synthwave",
    name: "Retro Synthwave",
    description: "80s-inspired synthwave design with neon grids and retro animations",
    preview: "Nostalgic 80s aesthetic with neon colors and synthwave vibes",
    category: "creative",
    features: ["Synthwave Theme", "Neon Grids", "80s Aesthetic", "Retro Animations"],
    icon: Star,
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop"
  },
  {
    id: "paper-origami",
    name: "Paper Origami",
    description: "Paper-fold effects with origami-style transitions and 3D depth",
    preview: "Elegant paper-fold animations with origami-inspired interactions",
    category: "3d",
    features: ["Paper Effects", "Origami Transitions", "3D Depth", "Fold Animations"],
    icon: Layers,
    thumbnailUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop"
  },
  {
    id: "neural-network",
    name: "Neural Network",
    description: "AI-themed portfolio with neural network visualizations and data flow animations",
    preview: "Tech-forward design with animated neural networks and data visualizations",
    category: "animated",
    features: ["Neural Networks", "Data Animations", "AI Theme", "Tech Visualizations"],
    icon: Rocket,
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop"
  },
  {
    id: "magnetic-hover",
    name: "Magnetic Hover",
    description: "Interactive elements with magnetic hover effects and smooth transitions",
    preview: "Dynamic portfolio where elements magnetically attract to cursor movement",
    category: "modern",
    features: ["Magnetic Effects", "Hover Interactions", "Smooth Transitions", "Cursor Following"],
    icon: Wand2,
    thumbnailUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop"
  },
  {
    id: "isometric-world",
    name: "Isometric World",
    description: "3D isometric design with miniature world elements and perspective animations",
    preview: "Unique isometric perspective with 3D world elements and miniature aesthetics",
    category: "3d",
    features: ["Isometric Design", "3D World", "Perspective Effects", "Miniature Style"],
    icon: Box,
    thumbnailUrl: "https://images.unsplash.com/photo-1617791160588-241658c0f566?w=400&h=300&fit=crop",
    isPremium: true
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  onTemplateSelect: (template: PortfolioTemplate) => void;
  onClose: () => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect, onClose }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplate | null>(null);

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
    { id: "modern", name: "Modern", count: templates.filter(t => t.category === "modern").length },
    { id: "3d", name: "3D Effects", count: templates.filter(t => t.category === "3d").length },
    { id: "animated", name: "Animated", count: templates.filter(t => t.category === "animated").length },
    { id: "creative", name: "Creative", count: templates.filter(t => t.category === "creative").length },
    { id: "minimal", name: "Minimal", count: templates.filter(t => t.category === "minimal").length },
  ];

  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === activeCategory);

  const handlePreview = (template: PortfolioTemplate) => {
    setPreviewTemplate(template);
  };

  const handleSelect = (template: PortfolioTemplate) => {
    onTemplateSelect(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Choose Your Portfolio Template</h2>
            <p className="text-muted-foreground mt-2">
              Select a template that represents your style and personality
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`group cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="p-0">
                {/* Template Preview */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handlePreview(template)}
                          className="flex-1"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSelect(template)}
                          className="flex-1"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Crown className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  {/* Selected Indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center">
                      <template.icon className="mr-2 h-4 w-4" />
                      {template.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {template.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.features.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSelect(template)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Select
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category to see more templates.
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center">
                  <previewTemplate.icon className="mr-3 h-6 w-6" />
                  {previewTemplate.name}
                </h3>
                <p className="text-muted-foreground">{previewTemplate.description}</p>
              </div>
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Close Preview
              </Button>
            </div>

            {/* Template Preview */}
            <div className="mb-6">
              <img
                src={previewTemplate.thumbnailUrl}
                alt={previewTemplate.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Features Included:</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {previewTemplate.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => handleSelect(previewTemplate)} className="flex-1">
                <Check className="mr-2 h-4 w-4" />
                Select This Template
              </Button>
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Continue Browsing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
