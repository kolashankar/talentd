import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Portfolio {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  profileImage?: string;
  resumeUrl?: string;
  projects: {
    title: string;
    description: string;
    technologies: string[];
    demoUrl?: string;
    githubUrl?: string;
    image?: string;
  }[];
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }[];
  isPublic: boolean;
  theme: string;
  templateId?: string;
}

export default function TemplateLiveView() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: portfolio, isLoading, error } = useQuery<Portfolio>({
    queryKey: [`/api/portfolios/${id}`],
    enabled: !!id,
  });

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/portfolio/template/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share this link to show your portfolio",
    });
  };

  const handleOpenInNewTab = () => {
    window.open(`/portfolio/template/${id}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Portfolio not found</h2>
          <p className="text-muted-foreground mb-6">The portfolio you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/portfolio')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolios
          </Button>
        </div>
      </div>
    );
  }

  // Load the template component dynamically based on templateId
  const templateId = portfolio.templateId || 'modern-minimal';

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button variant="secondary" size="sm" onClick={handleShare} data-testid="button-share">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="secondary" size="sm" onClick={handleOpenInNewTab} data-testid="button-new-tab">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
        {portfolio.resumeUrl && (
          <Button variant="secondary" size="sm" asChild data-testid="button-download">
            <a href={portfolio.resumeUrl} download>
              <Download className="h-4 w-4 mr-2" />
              Resume
            </a>
          </Button>
        )}
      </div>

      {/* Template Content */}
      <div className="portfolio-template-container">
        {/* Modern Minimal Template */}
        {templateId === 'modern-minimal' && (
          <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  {portfolio.profileImage && (
                    <img 
                      src={portfolio.profileImage} 
                      alt={portfolio.name} 
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white"
                    />
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{portfolio.name}</h1>
                  <p className="text-xl md:text-2xl text-blue-100 mb-6">{portfolio.title}</p>
                  <p className="text-lg text-blue-50 max-w-2xl mx-auto">{portfolio.bio}</p>
                  
                  {/* Contact Info */}
                  <div className="flex flex-wrap justify-center gap-4 mt-8">
                    {portfolio.email && (
                      <a href={`mailto:${portfolio.email}`} className="text-white hover:text-blue-200">
                        {portfolio.email}
                      </a>
                    )}
                    {portfolio.phone && (
                      <span className="text-white">{portfolio.phone}</span>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 mt-6">
                    {portfolio.linkedin && (
                      <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200">
                        LinkedIn
                      </a>
                    )}
                    {portfolio.github && (
                      <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200">
                        GitHub
                      </a>
                    )}
                    {portfolio.website && (
                      <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200">
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {portfolio.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Projects Section */}
            {portfolio.projects && portfolio.projects.length > 0 && (
              <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {portfolio.projects.map((project, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {project.image && (
                          <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-4">
                            {project.demoUrl && (
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Live Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Experience Section */}
            {portfolio.experience && portfolio.experience.length > 0 && (
              <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
                  <div className="space-y-8">
                    {portfolio.experience.map((exp, index) => (
                      <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{exp.company} • {exp.duration}</p>
                        <p className="text-gray-700 dark:text-gray-400">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Education Section */}
            {portfolio.education && portfolio.education.length > 0 && (
              <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-bold mb-12 text-center">Education</h2>
                  <div className="space-y-6">
                    {portfolio.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-1">{edu.institution}</p>
                        <p className="text-gray-500 dark:text-gray-400">{edu.year}{edu.grade && ` • ${edu.grade}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Tech Portfolio Template */}
        {templateId === 'tech-portfolio' && (
          <div className="min-h-screen bg-gray-900 text-white">
            {/* Similar structure but with dark tech theme */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl font-bold mb-4">{portfolio.name}</h1>
                <p className="text-2xl text-purple-100 mb-6">{portfolio.title}</p>
                <p className="text-lg text-purple-50">{portfolio.bio}</p>
              </div>
            </section>
            {/* Add similar sections as modern-minimal with tech styling */}
          </div>
        )}

        {/* Creative Professional Template */}
        {templateId === 'creative-professional' && (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            {/* Creative layout with bold colors */}
            <section className="py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {portfolio.profileImage && (
                    <img 
                      src={portfolio.profileImage} 
                      alt={portfolio.name} 
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  )}
                  <div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      {portfolio.name}
                    </h1>
                    <p className="text-2xl text-gray-700 dark:text-gray-200 mb-6">{portfolio.title}</p>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{portfolio.bio}</p>
                  </div>
                </div>
              </div>
            </section>
            {/* Add similar sections with creative styling */}
          </div>
        )}
      </div>
    </div>
  );
}
