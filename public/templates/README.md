
# Portfolio Template Development Guide

## Overview

This guide explains how to create custom portfolio templates that can be uploaded and used in the Portfolio Builder system.

## Template Structure

Each template should be a `.zip` file with the following structure:

```
my-template.zip
├── manifest.json       # Required: Template metadata
├── index.tsx          # Required: Main React component
├── thumbnail.png      # Optional: Preview image (800x600px recommended)
└── components/        # Optional: Additional components
    └── CustomSection.tsx
```

## manifest.json

The manifest file defines your template's metadata:

```json
{
  "id": "unique-template-id",
  "name": "Template Display Name",
  "version": "1.0.0",
  "description": "Brief description of your template",
  "author": "Your Name",
  "category": "modern|creative|minimal|3d|animated|professional",
  "entryFile": "index.tsx",
  "thumbnail": "thumbnail.png",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "isPremium": false,
  "config": {
    "supportsEmailJS": true,
    "supportsThemes": true,
    "supportsAnimations": true
  }
}
```

## Main Component (index.tsx)

Your main component receives portfolio data as props:

```tsx
import { TemplateProps } from '@shared/template-types';
import { ContactForm, Section, SkillBadge } from '../shared/components';

export default function MyTemplate({ data, theme, emailJSConfig }: TemplateProps) {
  return (
    <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
      <header>
        <h1>{data.personal.name}</h1>
        <p>{data.personal.title}</p>
      </header>

      {/* Skills */}
      <Section title="Skills">
        {data.skills.map(skill => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </Section>

      {/* Contact Form */}
      <ContactForm userEmail={data.personal.email} />
    </div>
  );
}
```

## Available Data Structure

Your template receives the following data:

```typescript
interface PortfolioTemplateData {
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
```

## Shared Components

Import pre-built components from `../shared/components`:

- `ContactForm` - Email contact form with EmailJS integration
- `Section` - Consistent section wrapper
- `SkillBadge` - Skill tag component
- `ProjectCard` - Project display card
- `ExperienceCard` - Experience timeline item
- `EducationCard` - Education display card

## Styling Guidelines

1. Use TailwindCSS classes for styling
2. Support both light and dark themes
3. Ensure responsive design (mobile-first)
4. Use smooth animations with Framer Motion or CSS transitions
5. Maintain accessibility standards (ARIA labels, semantic HTML)

## Testing Your Template

1. Create a `.zip` file with your template files
2. Go to Admin Dashboard → Template Management
3. Upload your `.zip` file
4. Test it in the Portfolio Builder

## Best Practices

✅ **DO:**
- Use semantic HTML elements
- Implement responsive design
- Support theme switching
- Include loading states
- Add error boundaries
- Comment your code

❌ **DON'T:**
- Use hardcoded data
- Rely on external CDNs (bundle dependencies)
- Use inline styles (prefer Tailwind)
- Forget accessibility features
- Skip error handling

## Example Templates

Check the `modern-minimal` template for a complete working example:
- `/templates/modern-minimal/manifest.json`
- `/templates/modern-minimal/index.tsx`

## Upload Process

1. Compress your template folder as a `.zip` file
2. Ensure all required files are at the root level (not in a subfolder)
3. Upload via Admin Dashboard
4. The system will automatically:
   - Extract files to `/public/templates/{template-id}/`
   - Validate the manifest
   - Register in the template registry
   - Make it available to users

## Questions?

Contact the admin team for support with template development.
