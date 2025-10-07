import { z } from "zod";

// Template Manifest Schema
export const templateManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  category: z.enum(['modern', 'creative', 'minimal', '3d', 'animated', 'professional']),
  thumbnail: z.string().optional(),
  entryFile: z.string(), // Main component file (e.g., "index.tsx")
  features: z.array(z.string()).default([]),
  isPremium: z.boolean().default(false),
  dependencies: z.record(z.string()).optional(), // npm dependencies
  peerDependencies: z.record(z.string()).optional(),
  files: z.object({
    pages: z.array(z.string()).default([]),
    components: z.array(z.string()).default([]),
    assets: z.array(z.string()).default([]),
    styles: z.array(z.string()).default([]),
  }).optional(),
  config: z.object({
    supportsEmailJS: z.boolean().default(true),
    supportsThemes: z.boolean().default(true),
    supportsAnimations: z.boolean().default(true),
  }).optional(),
});

export type TemplateManifest = z.infer<typeof templateManifestSchema>;

// Template Registry Entry
export interface TemplateRegistryEntry {
  id: string;
  name: string;
  version: string;
  description?: string;
  category: string;
  thumbnail?: string;
  manifestPath: string;
  entryPath: string;
  features: string[];
  isPremium: boolean;
  isActive: boolean;
  uploadedAt: string;
  updatedAt: string;
}

// Portfolio Data that gets passed to templates
export interface PortfolioTemplateData {
  personal: {
    name: string;
    title: string;
    bio?: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    profileImage?: string;
  };
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Template Props Interface
export interface TemplateProps {
  data: PortfolioTemplateData;
  theme?: 'light' | 'dark';
  emailJSConfig?: {
    serviceId: string;
    templateId: string;
    userId: string;
  };
}

// Template Component Interface
export interface TemplateComponent {
  default: React.ComponentType<TemplateProps>;
  metadata?: {
    name: string;
    description: string;
  };
}
