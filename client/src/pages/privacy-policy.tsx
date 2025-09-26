
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
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
                <Shield className="h-5 w-5" />
                <span>Our Commitment to Your Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                At our platform, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Professional information (job title, company, skills)</li>
                  <li>Resume and portfolio content you choose to share</li>
                  <li>Account credentials and authentication data</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>How you interact with our platform and features</li>
                  <li>Pages visited and time spent on our services</li>
                  <li>Search queries and job preferences</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">AI-Generated Content</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Resume analysis results and suggestions</li>
                  <li>Generated portfolio content and templates</li>
                  <li>AI-created visual assets and designs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Service Provision</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Create and manage your account</li>
                    <li>Provide job recommendations</li>
                    <li>Generate AI-powered content</li>
                    <li>Analyze and improve your resume</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Communication</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Send important service updates</li>
                    <li>Respond to your inquiries</li>
                    <li>Share relevant job opportunities</li>
                    <li>Provide customer support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Data Protection & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Security Measures</h3>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your data, including encryption, 
                  secure servers, and regular security audits. Your resume data is processed securely and 
                  AI-generated content is created with privacy in mind.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain your personal information only as long as necessary to provide our services 
                  and comply with legal obligations. You can request data deletion at any time through 
                  your account settings.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Third-Party Services</h3>
                <p className="text-muted-foreground">
                  We use trusted third-party services for AI processing (Google Gemini), authentication, 
                  and analytics. These services have their own privacy policies and security measures.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Your Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Data Control</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Access your personal data</li>
                    <li>Update or correct information</li>
                    <li>Delete your account and data</li>
                    <li>Export your data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Privacy Controls</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Control portfolio visibility</li>
                    <li>Manage communication preferences</li>
                    <li>Opt out of data processing</li>
                    <li>Request data portability</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please don't hesitate to contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@yourplatform.com</p>
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
