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
import { Link } from "wouter";
import { GoogleAuth } from "@/components/auth/google-auth";
import { 
  FileText, 
  TrendingUp, 
  Globe, 
  Code, 
  Users, 
  Target,
  Star,
  ArrowRight,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  BarChart3
} from "lucide-react";

export default function Home() {
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['/api/articles'],
  });

  const { data: roadmaps = [] } = useQuery({
    queryKey: ['/api/roadmaps'],
  });

  const featuredJobs = jobs.slice(0, 6);
  const stats = [
    { label: "Active Members", value: "50,000+", icon: Users },
    { label: "Monthly Readers", value: "623,117", icon: TrendingUp },
    { label: "LinkedIn Followers", value: "42,528", icon: Users },
    { label: "Registered Users", value: "102,205", icon: Target },
  ];

  const services = [
    {
      title: "Resume Review",
      description: "Get expert feedback on your resume with our AI-powered ATS reviewer",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/20",
      href: "/resume-review"
    },
    {
      title: "Job Tracker",
      description: "Track your application progress and never miss a follow-up",
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
      href: "#"
    },
    {
      title: "Portfolio Builder",
      description: "Create stunning portfolios with integrated resume showcase",
      icon: Globe,
      color: "text-primary",
      bgColor: "bg-primary/20",
      href: "/portfolio"
    },
    {
      title: "DSA Corner",
      description: "Master algorithms and data structures with our comprehensive guides",
      icon: Code,
      color: "text-accent",
      bgColor: "bg-accent/20",
      href: "#"
    },
    {
      title: "Community",
      description: "Connect with 50,000+ tech freshers and get referrals",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
      href: "#"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8e5?w=64&h=64&fit=crop&crop=face",
      content: "TalentFresh helped me land my first job at Google. The resume review feature was incredibly helpful in optimizing my application for ATS systems.",
      rating: 5
    },
    {
      name: "Rahul Verma", 
      role: "Frontend Developer at Amazon",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      content: "The DSA Corner helped me crack Amazon's technical rounds. The community support was amazing throughout my job search journey.",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "Product Manager at Microsoft", 
      avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=64&h=64&fit=crop&crop=face",
      content: "Got a direct referral through the TalentFresh community. The portfolio builder helped showcase my projects professionally.",
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
              <div className="text-2xl font-bold text-primary">TalentFresh</div>
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
              <GoogleAuth />
              <Button size="sm" data-testid="button-join-community">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced UI */}
      <ParallaxHero
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&h=1560"
        overlay="rgba(15, 23, 42, 0.9)"
      >
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
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 fade-in-up relative z-30" style={{"--stagger": "1"} as any}>
                  Launch Your <span className="text-accent">Tech Career</span> Today
                </h1>
                <p className="text-xl text-gray-300 mb-8 fade-in-up relative z-30" style={{"--stagger": "2"} as any}>
                  Join 50,000+ freshers who landed tech jobs with our AI-powered platform, personalized learning paths, and supportive community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8 fade-in-up relative z-30" style={{"--stagger": "3"} as any}>
                  <Link href="/jobs">
                    <Button size="lg" className="text-lg font-semibold hover:scale-105 transition-all" data-testid="button-find-jobs">
                      <Briefcase className="mr-2 h-5 w-5" />
                      Find Jobs
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg font-semibold bg-transparent border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all"
                    data-testid="button-join-community-hero"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Join Community
                  </Button>
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

            {/* Right Side - Analytics Dashboard */}
            <div className="fade-in-up relative z-20" style={{"--stagger": "5"} as any}>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Live Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Real-time metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">1,247</div>
                      <div className="text-xs text-gray-300">Jobs Posted Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">892</div>
                      <div className="text-xs text-gray-300">Applications Sent</div>
                    </div>
                  </div>

                  {/* Success Rate Chart */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Success Rate</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{width: "78%"}}></div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Recent Activity</h4>
                    <div className="space-y-1 text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Raj got hired at Google</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>New React roadmap published</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>50+ new internships added</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ParallaxHero>

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

          <HorizontalScroll>
            <div className="flex space-x-6 pb-4">
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
                TalentFresh freshers have secured positions at these top tech companies
              </p>
            </div>
          </ScrollAnimations>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" data-testid={`company-${company.name.toLowerCase()}`}>
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="h-12 w-auto filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
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
                Ready to Land Your First Tech Job? Join 50,000+ freshers who launched their tech careers with TalentFresh's resources, community, and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg font-semibold" data-testid="button-create-account">
                  Create Free Account
                </Button>
                <Button size="lg" variant="outline" className="text-lg font-semibold bg-transparent border-white text-white hover:bg-white hover:text-primary" data-testid="button-browse-jobs">
                  Browse Fresher Jobs
                </Button>
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
              <div className="text-2xl font-bold text-primary mb-4" data-testid="footer-logo">TalentFresh</div>
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
                © 2024 TalentFresh. All rights reserved.
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