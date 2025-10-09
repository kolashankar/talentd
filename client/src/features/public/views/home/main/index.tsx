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
import { 
  FileText, 
  TrendingUp, 
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
  BarChart3
} from "lucide-react";

export default function Home() {
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
      {/* Hero Section */}
      <ParallaxHero backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Launch Your Tech Career
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            India's #1 platform for freshers - Find jobs, internships, roadmaps, and DSA practice all in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs">
              <Button size="lg" className="gap-2" data-testid="button-hero-jobs">
                Explore Jobs
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20" data-testid="button-hero-register">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </ParallaxHero>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="hover-elevate">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive resources for freshers entering the tech industry
            </p>
          </div>

          <HorizontalScroll>
            <div className="flex gap-6 pb-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card 
                    key={service.title} 
                    className="flex-shrink-0 w-80 hover-elevate"
                  >
                    <CardHeader>
                      <div className={`${service.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <Link href={service.href}>
                        <Button className="w-full gap-2" data-testid={`button-${service.title.toLowerCase().replace(" ", "-")}`}>
                          {service.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </HorizontalScroll>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Opportunities</h2>
              <p className="text-lg text-muted-foreground">Latest jobs for freshers</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" data-testid="button-view-all-jobs">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {jobsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-48 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Structured Learning Paths
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Step-by-step roadmaps to achieve your career goals
            </p>
          </div>

          <StackedCards>
            <div className="space-y-6">
              {Array.isArray(roadmaps) && roadmaps.slice(0, 3).map((roadmap: any) => (
                <Card key={roadmap.id} className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{roadmap.title}</span>
                      <Badge>{roadmap.difficulty}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{roadmap.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {roadmap.tags?.slice(0, 4).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <Link href={`/roadmaps/${roadmap.id}`}>
                      <Button variant="outline" className="w-full" data-testid={`button-roadmap-${roadmap.id}`}>
                        Start Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </StackedCards>

          <div className="text-center mt-8">
            <Link href="/roadmaps">
              <Button size="lg" data-testid="button-view-all-roadmaps">
                View All Roadmaps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from freshers who landed their dream tech jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground">
              Freshers from Talentd work at
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {companies.map((company) => (
              <img
                key={company.name}
                src={company.logo}
                alt={company.name}
                className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch Your Tech Career?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of freshers who've successfully landed their dream tech jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2" data-testid="button-get-started">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" data-testid="button-browse-jobs">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/10 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Talentd</h3>
              <p className="text-sm text-muted-foreground">
                Empowering freshers to land their dream tech jobs
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/jobs" className="block text-sm text-muted-foreground hover:text-primary">
                  Jobs
                </Link>
                <Link href="/internships" className="block text-sm text-muted-foreground hover:text-primary">
                  Internships
                </Link>
                <Link href="/roadmaps" className="block text-sm text-muted-foreground hover:text-primary">
                  Roadmaps
                </Link>
                <Link href="/dsa" className="block text-sm text-muted-foreground hover:text-primary">
                  DSA Corner
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2">
                <Link href="/articles" className="block text-sm text-muted-foreground hover:text-primary">
                  Articles
                </Link>
                <Link href="/portfolio" className="block text-sm text-muted-foreground hover:text-primary">
                  Portfolio Builder
                </Link>
                <Link href="/resume-review" className="block text-sm text-muted-foreground hover:text-primary">
                  Resume Review
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="block text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
                <Link href="/support" className="block text-sm text-muted-foreground hover:text-primary">
                  Support
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Talentd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
