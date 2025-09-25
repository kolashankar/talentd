
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin,
  ExternalLink,
  Download,
  Share2,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Calendar
} from "lucide-react";

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
  createdAt: string;
}

export default function PortfolioView() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: portfolio, isLoading, error } = useQuery<Portfolio>({
    queryKey: [`/api/portfolios/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Portfolio not found</h2>
          <p className="text-muted-foreground mb-6">The portfolio you're looking for doesn't exist or is private.</p>
          <Button onClick={() => setLocation('/portfolio')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => setLocation('/portfolio')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolios
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              {portfolio.resumeUrl && (
                <Button variant="secondary" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {portfolio.profileImage ? (
              <img 
                src={portfolio.profileImage} 
                alt={portfolio.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-16 w-16" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{portfolio.name}</h1>
              <p className="text-xl opacity-90 mb-4">{portfolio.title}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                {portfolio.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {portfolio.email}
                  </div>
                )}
                {portfolio.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {portfolio.phone}
                  </div>
                )}
                {portfolio.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Website
                    </a>
                  </div>
                )}
                {portfolio.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
                {portfolio.github && (
                  <div className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      GitHub
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{portfolio.bio}</p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience Section */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolio.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {exp.duration}
                    </p>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {portfolio.projects.map((project, index) => (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-6">
                      {project.image && (
                        <div className="w-full h-48 mb-4">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <Button size="sm" asChild>
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Demo
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {portfolio.education && portfolio.education.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-primary">{edu.institution}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{edu.year}</span>
                      {edu.grade && <span>Grade: {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
