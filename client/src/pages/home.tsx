import { ParallaxHero } from "@/components/animations/parallax-hero";
import { StackedCards } from "@/components/animations/stacked-cards";
import { HorizontalScroll } from "@/components/animations/horizontal-scroll";
import { ScrollAnimations } from "@/components/animations/scroll-animations";
import { JobCard } from "@/components/job-card";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import { GoogleAuth } from "@/components/auth/google-auth";
import { useState } from "react";
import { 
  FileText, 
  TrendingUp, 
  Globe, 
  Code, 
  Users, 
  Target,
  Star,
  ArrowRight,
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  BarChart3,
  Menu
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: () => fetch('/api/jobs').then(res => res.json()),
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: () => fetch('/api/articles').then(res => res.json()),
  });

  const { data: roadmaps = [] } = useQuery({
    queryKey: ['/api/roadmaps'],
    queryFn: () => fetch('/api/roadmaps').then(res => res.json()),
  });

  const featuredJobs = Array.isArray(jobs) ? jobs.slice(0, 6) : [];
  const stats = [
    { label: "Active Members", value: "46,229", icon: Users, description: "Freshers helping freshers" },
    { label: "Monthly Readers", value: "623,117", icon: TrendingUp, description: "Tech career content" },
    { label: "LinkedIn Followers", value: "42,528", icon: Users, description: "Professional network" },
    { label: "Registered Users", value: "102,304", icon: Target, description: "Career focused freshers" },
  ];

  const services = [
    {
      title: "Career Launch",
      description: "Entry-level tech jobs",
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/20",
      href: "/jobs",
      cta: "Explore Now"
    },
    {
      title: "Learning Hub",
      description: "Fresher-focused resources",
      icon: GraduationCap,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
      href: "/articles",
      cta: "Explore Now"
    },
    {
      title: "Community",
      description: "50,000+ tech freshers",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/20",
      href: "/community",
      cta: "Explore Now"
    },
    {
      title: "Tech Roadmaps",
      description: "Guided career paths",
      icon: MapPin,
      color: "text-primary",
      bgColor: "bg-primary/20",
      href: "/roadmaps",
      cta: "Explore Now"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8e5?w=64&h=64&fit=crop&crop=face",
      content: "As a fresher with no industry experience, Talentd gave me the confidence and resources I needed to land my role at Google. The mock interviews were incredibly helpful!",
      rating: 5
    },
    {
      name: "Rahul Verma", 
      role: "Frontend Developer at Amazon",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      content: "The DSA practice on Talentd helped me crack Amazon's technical rounds. The detailed explanations made complex algorithms much easier to understand.",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "Product Manager at Microsoft", 
      avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=64&h=64&fit=crop&crop=face",
      content: "Talentd's community gave me a direct referral that fast-tracked my Microsoft application. The interview prep resources are gold for any fresher!",
      rating: 5
    }
  ];

  const companies = [
    { name: "Google", logo: "https://logo.clearbit.com/google.com" },
    { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
    { name: "IBM", logo: "https://logo.clearbit.com/ibm.com" },
    { name: "Infosys", logo: "https://logo.clearbit.com/infosys.com" },
    { name: "TCS", logo: "https://logo.clearbit.com/tcs.com" },
    { name: "Wipro", logo: "https://logo.clearbit.com/wipro.com" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-primary">Talentd</div>
              <div className="hidden md:flex space-x-6">
                <Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors">
                  Jobs
                </Link>
                <Link href="/internships" className="text-muted-foreground hover:text-primary transition-colors">
                  Internships
                </Link>
                <Link href="/roadmaps" className="text-muted-foreground hover:text-primary transition-colors">
                  Roadmaps
                </Link>
                <Link href="/dsa" className="text-muted-foreground hover:text-primary transition-colors">
                  DSA Corner
                </Link>
                <Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors">
                  Articles
                </Link>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <GoogleAuth />
                <Link href="/register">
                  <Button 
                    size="sm" 
                    data-testid="button-register"
                  >
                    Register
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-6 pt-8">
                    <div className="text-2xl font-bold text-primary">Talentd</div>

                    <div className="flex flex-col space-y-4">
                      <GoogleAuth />
                      <Link href="/register">
                        <Button size="sm" className="w-full" data-testid="button-register-mobile">
                          Register
                        </Button>
                      </Link>
                    </div>

                    <div className="border-t pt-6">
                      <nav className="flex flex-col space-y-4">
                        <Link href="/jobs" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Jobs
                        </Link>
                        <Link href="/internships" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Internships
                        </Link>
                        <Link href="/roadmaps" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Roadmaps
                        </Link>
                        <Link href="/dsa" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          DSA Corner
                        </Link>
                        <Link href="/articles" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Articles
                        </Link>
                        <Link href="/privacy-policy" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Terms of Service
                        </Link>
                        <Link href="/support" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Support
                        </Link>
                        <Link href="/admin" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                          Admin
                        </Link>
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced UI */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Side - Content */}
            <div className="relative z-20">
              <ScrollAnimations>
                <div className="mb-6 fade-in-up">
                  <Badge variant="secondary" className="inline-flex items-center bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
                    ✨ India's #1 Platform for Tech Freshers
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 fade-in-up relative z-30" style={{"--stagger": "1"} as any}>
                  From Campus to <span className="text-accent">Career</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 fade-in-up relative z-30" style={{"--stagger": "2"} as any}>
                  Join 50,000+ freshers who landed tech jobs with our entry-level opportunities, proven learning paths, and supportive community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8 fade-in-up relative z-30" style={{"--stagger": "3"} as any}>
                  <Link href="/jobs">
                    <Button size="lg" className="text-lg font-semibold hover:scale-105 transition-all" data-testid="button-find-jobs">
                      <Briefcase className="mr-2 h-5 w-5" />
                      Find Jobs
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="text-lg font-semibold bg-transparent border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all"
                      data-testid="button-register-hero"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Register
                    </Button>
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 fade-in-up relative z-30" style={{"--stagger": "4"} as any}>
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                      <div className="text-2xl font-bold text-accent" data-testid={`stat-value-${stat.label.toLowerCase().replace(' ', '-')}`}>
                        {stat.value}
                      </div>
                      <div className="text-gray-300 text-sm" data-testid={`stat-label-${stat.label.toLowerCase().replace(' ', '-')}`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollAnimations>
            </div>

            {/* Right Side - Job Hunting Illustration */}
            <div className="fade-in-up relative z-20" style={{"--stagger": "5"} as any}>
              <div className="relative">
                {/* Job Hunting Avatar Illustration */}
                <div className="w-full max-w-lg mx-auto">
                  <svg viewBox="0 0 400 400" className="w-full h-auto">
                    {/* Background Circle */}
                    <circle cx="200" cy="200" r="180" fill="url(#gradient1)" opacity="0.1"/>

                    {/* Person with laptop */}
                    <g transform="translate(150, 150)">
                      {/* Head */}
                      <circle cx="50" cy="30" r="20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>

                      {/* Hair */}
                      <path d="M30 25 Q50 15 70 25 Q65 20 60 15 Q50 10 40 15 Q35 20 30 25" fill="#374151"/>

                      {/* Face features */}
                      <circle cx="45" cy="28" r="1.5" fill="#374151"/>
                      <circle cx="55" cy="28" r="1.5" fill="#374151"/>
                      <path d="M47 35 Q50 37 53 35" stroke="#374151" strokeWidth="1" fill="none"/>

                      {/* Body */}
                      <rect x="35" y="50" width="30" height="40" rx="5" fill="#3b82f6"/>

                      {/* Arms */}
                      <rect x="25" y="55" width="10" height="25" rx="5" fill="#fbbf24"/>
                      <rect x="65" y="55" width="10" height="25" rx="5" fill="#fbbf24"/>

                      {/* Laptop */}
                      <rect x="30" y="75" width="40" height="25" rx="2" fill="#374151"/>
                      <rect x="32" y="77" width="36" height="18" rx="1" fill="#1f2937"/>
                      <rect x="34" y="79" width="32" height="14" rx="1" fill="#60a5fa"/>

                      {/* Screen content - code lines */}
                      <rect x="36" y="81" width="8" height="1" fill="#ffffff"/>
                      <rect x="36" y="83" width="12" height="1" fill="#ffffff"/>
                      <rect x="36" y="85" width="6" height="1" fill="#ffffff"/>
                      <rect x="36" y="87" width="10" height="1" fill="#ffffff"/>

                      {/* Legs */}
                      <rect x="40" y="90" width="8" height="30" rx="4" fill="#1f2937"/>
                      <rect x="52" y="90" width="8" height="30" rx="4" fill="#1f2937"/>
                    </g>

                    {/* Floating job icons around the person */}
                    <g opacity="0.8">
                      {/* Job icon 1 */}
                      <circle cx="100" cy="100" r="15" fill="#ef4444" opacity="0.9">
                        <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite"/>
                      </circle>
                      <text x="100" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">JS</text>

                      {/* Job icon 2 */}
                      <circle cx="320" cy="120" r="15" fill="#10b981" opacity="0.9">
                        <animate attributeName="cy" values="120;110;120" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <text x="320" y="125" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">REACT</text>

                      {/* Job icon 3 */}
                      <circle cx="80" cy="280" r="15" fill="#8b5cf6" opacity="0.9">
                        <animate attributeName="cy" values="280;270;280" dur="3.5s" repeatCount="indefinite"/>
                      </circle>
                      <text x="80" y="285" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">API</text>

                      {/* Job icon 4 */}
                      <circle cx="300" cy="300" r="15" fill="#f59e0b" opacity="0.9">
                        <animate attributeName="cy" values="300;290;300" dur="2.8s" repeatCount="indefinite"/>
                      </circle>
                      <text x="300" y="305" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">NODE</text>
                    </g>

                    {/* Floating resume/document icons */}
                    <g opacity="0.6">
                      <rect x="60" y="180" width="12" height="16" rx="2" fill="#3b82f6">
                        <animate attributeName="x" values="60;70;60" dur="4s" repeatCount="indefinite"/>
                      </rect>
                      <rect x="62" y="182" width="8" height="1" fill="white"/>
                      <rect x="62" y="184" width="6" height="1" fill="white"/>
                      <rect x="62" y="186" width="8" height="1" fill="white"/>

                      <rect x="330" y="200" width="12" height="16" rx="2" fill="#ef4444">
                        <animate attributeName="x" values="330;320;330" dur="3.2s" repeatCount="indefinite"/>
                      </rect>
                      <rect x="332" y="202" width="8" height="1" fill="white"/>
                      <rect x="332" y="204" width="6" height="1" fill="white"/>
                      <rect x="332" y="206" width="8" height="1" fill="white"/>
                    </g>

                    {/* Success indicators */}
                    <g opacity="0.7">
                      <circle cx="130" cy="80" r="8" fill="#10b981">
                        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <text x="130" y="85" textAnchor="middle" fill="white" fontSize="12">✓</text>

                      <circle cx="270" cy="90" r="8" fill="#10b981">
                        <animate attributeName="r" values="8;12;8" dur="2.3s" repeatCount="indefinite"/>
                      </circle>
                      <text x="270" y="95" textAnchor="middle" fill="white" fontSize="12">✓</text>
                    </g>

                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: "#3b82f6", stopOpacity: 1}}/>
                        <stop offset="100%" style={{stopColor: "#1d4ed8", stopOpacity: 1}}/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Live metrics overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-sm font-semibold text-slate-800">Live Jobs</div>
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-xs text-green-600">+23 today</div>
                </div>

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-sm font-semibold text-slate-800">Success Rate</div>
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <div className="text-xs text-slate-600">This month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs - Stacked Cards */}
      <section id="jobs" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimations>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up" data-testid="heading-featured-jobs">
                Featured Fresher Jobs
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up" data-testid="text-jobs-subtitle">
                Handpicked opportunities for tech beginners
              </p>
            </div>
          </ScrollAnimations>

          {jobsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="w-16 h-6 bg-muted rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <StackedCards>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredJobs.map((job, index) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    className="card-stack"
                    style={{"--stagger": index + 1} as any}
                    data-testid={`job-card-${job.id}`}
                  />
                ))}
              </div>
            </StackedCards>
          )}

          <div className="text-center mt-12">
            <Button size="lg" data-testid="button-view-all-jobs">
              View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services - Horizontal Scroll */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimations>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up" data-testid="heading-services">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up" data-testid="text-services-subtitle">
                Tools and resources designed for tech beginners
              </p>
            </div>
          </ScrollAnimations>

          <div className="relative">
            {/* Mobile Arrow Controls */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const container = document.getElementById('services-scroll');
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="z-10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const container = document.getElementById('services-scroll');
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="z-10"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <HorizontalScroll>
              <div id="services-scroll" className="flex space-x-6 pb-4 md:justify-center">
                {services.map((service, index) => (
                  <Link key={index} href={service.href}>
                    <Card className="w-80 horizontal-scroll-item hover:shadow-lg transition-all card-hover" data-testid={`service-card-${service.title.toLowerCase().replace(' ', '-')}`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 ${service.bgColor} ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                          <service.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" data-testid={`service-title-${service.title.toLowerCase().replace(' ', '-')}`}>
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground mb-4" data-testid={`service-description-${service.title.toLowerCase().replace(' ', '-')}`}>
                          {service.description}
                        </p>
                        <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium p-0" data-testid={`button-learn-more-${service.title.toLowerCase().replace(' ', '-')}`}>
                          Learn more <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </HorizontalScroll>
          </div>
        </div>
      </section>

      {/* Resume ATS Reviewer Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimations>
              <div className="fade-in-up">
                <h2 className="text-4xl font-bold mb-6" data-testid="heading-resume-review">
                  AI-Powered Resume Review
                </h2>
                <p className="text-xl text-muted-foreground mb-8" data-testid="text-resume-review-description">
                  Get instant feedback on your resume with our advanced ATS system. Improve your chances of landing interviews with personalized suggestions.
                </p>

                {/* Resume Upload Area */}
                <Card className="border-2 border-dashed border-border hover:border-primary transition-colors file-upload-area mb-6">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" data-testid="text-upload-title">
                      Upload Your Resume
                    </h3>
                    <p className="text-muted-foreground mb-4" data-testid="text-upload-subtitle">
                      PDF, DOC, or DOCX • Max 5MB
                    </p>
                    <Link href="/resume-review">
                      <Button data-testid="button-choose-file">
                        Choose File
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Features List */}
                <div className="space-y-4">
                  {[
                    "ATS Compatibility Score",
                    "Keyword Optimization", 
                    "Format & Structure Analysis",
                    "Personalized Improvement Tips"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3" data-testid={`feature-${feature.toLowerCase().replace(/[^\w]/g, '-')}`}>
                      <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center">
                        <span className="text-sm">✓</span>
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimations>

            {/* Resume Preview Mock */}
            <ScrollAnimations>
              <div className="fade-in-up" style={{"--stagger": "1"} as any}>
                <Card className="max-w-md mx-auto" data-testid="card-resume-preview">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold" data-testid="text-ats-score-title">ATS Score</h3>
                        <span className="text-2xl font-bold text-accent" data-testid="text-ats-score-value">85%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-accent h-3 rounded-full" style={{width: "85%"}}></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Keywords Match</span>
                        <span className="text-sm font-medium text-accent" data-testid="text-keywords-match">12/15</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Format Score</span>
                        <span className="text-sm font-medium text-secondary" data-testid="text-format-score">Excellent</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Readability</span>
                        <span className="text-sm font-medium text-accent" data-testid="text-readability-score">Very Good</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 text-sm" data-testid="text-suggestions-title">Top Suggestions:</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li data-testid="suggestion-1">• Add "React" and "Node.js" keywords</li>
                        <li data-testid="suggestion-2">• Include quantifiable achievements</li>
                        <li data-testid="suggestion-3">• Use more action verbs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollAnimations>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimations>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up" data-testid="heading-testimonials">
                Success Stories
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up" data-testid="text-testimonials-subtitle">
                Hear from freshers who landed their dream jobs
              </p>
            </div>
          </ScrollAnimations>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimations key={index}>
                <Card className="fade-in-up card-hover" style={{"--stagger": index + 1} as any} data-testid={`testimonial-card-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        data-testid={`avatar-${testimonial.name.toLowerCase().replace(' ', '-')}`}
                      />
                      <div>
                        <div className="font-semibold" data-testid={`name-${testimonial.name.toLowerCase().replace(' ', '-')}`}>
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-muted-foreground" data-testid={`role-${testimonial.name.toLowerCase().replace(' ', '-')}`}>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic mb-4" data-testid={`content-${testimonial.name.toLowerCase().replace(' ', '-')}`}>
                      "{testimonial.content}"
                    </p>
                    <div className="flex text-accent text-sm" data-testid={`rating-${testimonial.name.toLowerCase().replace(' ', '-')}`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimations>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimations>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up" data-testid="heading-companies">
                Our Members Work At
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up" data-testid="text-companies-subtitle">
                Talentd freshers have secured positions at these top tech companies
              </p>
            </div>
          </ScrollAnimations>

          <div className="relative overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8 items-center">
              {companies.map((company, index) => (
                <div 
                  key={index} 
                  className="group flex items-center justify-center p-4 rounded-lg bg-white/50 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer" 
                  data-testid={`company-${company.name.toLowerCase()}`}
                >
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="h-8 md:h-12 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = `https://via.placeholder.com/120x40/666666/ffffff?text=${company.name}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
              ))}
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/5 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimations>
            <div className="fade-in-up">
              <h2 className="text-4xl font-bold text-white mb-4" data-testid="heading-cta">
                Start Your Tech Journey Today
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto" data-testid="text-cta-subtitle">
                Ready to Land Your First Tech Job? Join 50,000+ freshers who launched their tech careers with Talentd's resources, community, and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="text-lg font-semibold" data-testid="button-create-account">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button size="lg" variant="outline" className="text-lg font-semibold bg-transparent border-white text-white hover:bg-white hover:text-primary" data-testid="button-browse-jobs">
                    Browse Fresher Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimations>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="text-2xl font-bold text-primary mb-4" data-testid="footer-logo">Talentd</div>
              <p className="text-muted-foreground mb-4" data-testid="footer-description">
                India's #1 platform for tech freshers. Join 50,000+ freshers who launched their tech careers with us.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                  LinkedIn
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-github">
                  GitHub
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-discord">
                  Discord
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4" data-testid="footer-heading-quick-links">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-jobs">Jobs</Link></li>
                <li><Link href="/internships" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-internships">Internships</Link></li>
                <li><Link href="/roadmaps" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-roadmaps">Roadmaps</Link></li>
                <li><Link href="/dsa" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-dsa">DSA Corner</Link></li>
                <li><Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-articles">Articles</Link></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h3 className="font-semibold mb-4" data-testid="footer-heading-tools">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/resume-review" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-resume-review">Resume Review</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-job-tracker">Job Tracker</a></li>
                <li><Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-portfolio">Portfolio Builder</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-calculator">Income Tax Calculator</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-community">Community</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4" data-testid="footer-heading-contact">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground" data-testid="footer-email">
                  📧 hello@talentfresh.in
                </li>
                <li className="text-muted-foreground" data-testid="footer-phone">
                  📞 +91 9876543210
                </li>
                <li className="text-muted-foreground" data-testid="footer-location">
                  📍 Bangalore, India
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
                © 2024 Talentd. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors" data-testid="footer-link-privacy">Privacy Policy</a>
                <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors" data-testid="footer-link-terms">Terms of Service</a>
                <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors" data-testid="footer-link-support">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}