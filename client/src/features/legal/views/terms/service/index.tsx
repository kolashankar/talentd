
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Terms of Service</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Agreement to Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to our career development platform. By accessing and using our services, you agree to be bound by these Terms of Service. 
                Please read them carefully before using our platform.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our platform provides career development services including:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">For All Users</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Job listings and search</li>
                    <li>Learning roadmaps</li>
                    <li>Educational articles</li>
                    <li>Coding problem sets</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">For Signed-In Users</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>AI-powered portfolio builder</li>
                    <li>Resume ATS analysis</li>
                    <li>Job tracker and applications</li>
                    <li>Personalized recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Registration</h3>
                <p className="text-muted-foreground">
                  To access premium features like portfolio building and resume analysis, you must create an account. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">User Content</h3>
                <p className="text-muted-foreground">
                  You retain ownership of content you submit (resumes, portfolio information, etc.). 
                  By using our AI services, you grant us permission to process your content to provide our services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Submitting false or misleading information</li>
                  <li>Attempting to breach security measures</li>
                  <li>Using the service for illegal activities</li>
                  <li>Sharing account credentials with others</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Services */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">AI Content Generation</h3>
                <p className="text-muted-foreground">
                  Our AI services, powered by Google Gemini, generate content including portfolio websites, 
                  resume analysis, and professional suggestions. While we strive for accuracy, 
                  AI-generated content should be reviewed and verified by you.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Data Processing</h3>
                <p className="text-muted-foreground">
                  Your resume and portfolio data may be processed by AI services to provide personalized 
                  recommendations and content generation. We do not store your data with third-party AI providers 
                  beyond the processing session.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Generated Content Rights</h3>
                <p className="text-muted-foreground">
                  You own the content generated through our AI services. However, you are responsible 
                  for ensuring the accuracy and appropriateness of AI-generated content before use.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5" />
                <span>Intellectual Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Platform Rights</h3>
                <p className="text-muted-foreground">
                  The platform, its features, design, and underlying technology are owned by us and protected 
                  by intellectual property laws. You may not copy, modify, or redistribute our platform.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">User Content</h3>
                <p className="text-muted-foreground">
                  You retain all rights to your original content. By uploading content, you grant us a 
                  license to use it solely for providing our services and generating AI-powered suggestions.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Generated Code and Assets</h3>
                <p className="text-muted-foreground">
                  Portfolio code and assets generated through our AI services are provided to you with 
                  full usage rights. You may download, modify, and deploy them as needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitations and Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Limitations and Disclaimers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <p className="text-muted-foreground">
                  We strive to maintain high availability but cannot guarantee uninterrupted service. 
                  Maintenance, updates, and technical issues may temporarily affect access.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">AI Accuracy</h3>
                <p className="text-muted-foreground">
                  AI-generated content and suggestions are provided as-is. While we use advanced AI technology, 
                  results may not always be perfect. You should review and verify all AI-generated content.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Job Listings</h3>
                <p className="text-muted-foreground">
                  Job listings are provided by third parties or generated for educational purposes. 
                  We do not guarantee the accuracy or availability of job opportunities.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Either party may terminate the service relationship at any time:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>You may delete your account at any time through account settings</li>
                <li>We may terminate accounts that violate these terms</li>
                <li>Upon termination, your data will be deleted according to our Privacy Policy</li>
                <li>Generated content and downloads remain yours after termination</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Questions about these Terms of Service? Contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@yourplatform.com</p>
                <p><strong>Address:</strong> [Your Company Address]</p>
                <p><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
