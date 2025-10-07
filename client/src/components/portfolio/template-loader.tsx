import { lazy, Suspense, ComponentType } from 'react';
import type { TemplateProps } from '@shared/template-types';

interface TemplateLoaderProps {
  templateId: string;
  data: any;
  theme?: 'light' | 'dark';
  emailJSConfig?: {
    serviceId: string;
    templateId: string;
    userId: string;
  };
}

// Dynamic template loader with lazy loading
export function TemplateLoader({ templateId, data, theme, emailJSConfig }: TemplateLoaderProps) {
  // Load template dynamically from public/templates directory
  const TemplateComponent = lazy(() => 
    import(/* @vite-ignore */ `/templates/${templateId}/index.tsx`)
      .then((module) => ({ default: module.default || module }))
      .catch((error) => {
        console.error(`Failed to load template ${templateId}:`, error);
        return { default: FallbackTemplate };
      })
  );

  return (
    <Suspense fallback={<TemplateLoadingFallback />}>
      <TemplateComponent 
        data={data} 
        theme={theme}
        emailJSConfig={emailJSConfig}
      />
    </Suspense>
  );
}

// Loading fallback component
function TemplateLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading template...</p>
      </div>
    </div>
  );
}

// Fallback template when loading fails
function FallbackTemplate({ data }: TemplateProps) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{data.personal.name}</h1>
          <p className="text-xl text-muted-foreground">{data.personal.title}</p>
          {data.personal.bio && (
            <p className="mt-4 text-muted-foreground">{data.personal.bio}</p>
          )}
        </div>

        {data.skills && data.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-sm px-2 py-1 bg-muted rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="text-center text-muted-foreground">
          <p>Template failed to load. Showing basic layout.</p>
        </div>
      </div>
    </div>
  );
}
