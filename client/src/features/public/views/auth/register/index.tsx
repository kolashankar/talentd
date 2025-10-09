
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GoogleAuth } from "@/components/auth/google-auth";
import { Link } from "wouter";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Users,
  Star,
  TrendingUp
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    experience: "",
    skills: "",
    interests: "",
    goals: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in your name and email address",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: data.message || "Welcome to the Talentd community. Check your email for next steps.",
        });

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          location: "",
          education: "",
          experience: "",
          skills: "",
          interests: "",
          goals: ""
        });
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: "Join 50,000+ Tech Freshers",
      description: "Connect with like-minded freshers and industry professionals"
    },
    {
      icon: Briefcase,
      title: "Exclusive Job Opportunities",
      description: "Access to fresher-specific jobs and internships"
    },
    {
      icon: Star,
      title: "Free Resume Review",
      description: "AI-powered ATS optimization for better job applications"
    },
    {
      icon: TrendingUp,
      title: "Career Growth Resources",
      description: "Learning paths, DSA practice, and skill development"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="text-2xl font-bold text-primary">Talentd</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Join India's #1 Tech Fresher Community
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-300">
                Launch your tech career with 50,000+ freshers who found their dream jobs through Talentd
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="w-12 h-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Placement Success Rate</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-primary">₹12L</div>
                <div className="text-sm text-muted-foreground">Average Package</div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <p className="text-muted-foreground">
                Join thousands of freshers who landed their dream tech jobs
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sign In */}
              <div className="space-y-4">
                <GoogleAuth />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or register with details
                    </span>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          type="text"
                          placeholder="Bangalore"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Select onValueChange={(value) => handleInputChange("education", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech/B.E.</SelectItem>
                        <SelectItem value="bsc">B.Sc Computer Science</SelectItem>
                        <SelectItem value="bca">BCA</SelectItem>
                        <SelectItem value="mtech">M.Tech/M.E.</SelectItem>
                        <SelectItem value="msc">M.Sc</SelectItem>
                        <SelectItem value="mca">MCA</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher">Complete Fresher (0 experience)</SelectItem>
                        <SelectItem value="internship">Internship Experience</SelectItem>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="2+">2+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="skills">Technical Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="e.g., JavaScript, React, Python, Java, etc."
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="interests">Career Interests</Label>
                    <Textarea
                      id="interests"
                      placeholder="e.g., Web Development, Mobile Apps, Data Science, etc."
                      value={formData.interests}
                      onChange={(e) => handleInputChange("interests", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Join Talentd Community
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By registering, you agree to our{" "}
                  <Link href="/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
