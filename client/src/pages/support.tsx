
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, HelpCircle, MessageSquare, BookOpen, Mail, Search } from "lucide-react";
import { Link } from "wouter";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const faqs = [
    {
      category: "Account",
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button and follow the registration process. You can sign up with Google or create a new account with your email."
    },
    {
      category: "Portfolio",
      question: "How does the AI portfolio generator work?",
      answer: "Our AI uses your resume and prompt to generate a complete portfolio website with modern design, images, and code. You can then edit and download the generated website."
    },
    {
      category: "Resume",
      question: "What file formats are supported for resume analysis?",
      answer: "We support PDF, DOC, and DOCX formats. Files should be under 5MB for optimal processing."
    },
    {
      category: "Technical",
      question: "Can I download the generated portfolio code?",
      answer: "Yes! You can download the complete website code including HTML, CSS, and JavaScript files in a structured folder format."
    },
    {
      category: "Account",
      question: "What features require a signed-in account?",
      answer: "Portfolio building, resume ATS analysis, and job tracking features require you to be signed in. Job listings and educational content are available to all users."
    },
    {
      category: "Portfolio",
      question: "Can I edit the AI-generated website?",
      answer: "Absolutely! You can provide edit instructions to the AI to modify colors, layout, content, and styling. The AI will update your website based on your feedback."
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Support Center</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">How can we help you?</h2>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help topics, features, or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("")}
                >
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/privacy-policy">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/terms-of-service">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Terms of Service
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* FAQ Section */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <HelpCircle className="h-5 w-5" />
                <h2 className="text-2xl font-bold">
                  Frequently Asked Questions
                  {(searchQuery || selectedCategory) && (
                    <span className="text-lg font-normal text-muted-foreground ml-2">
                      ({filteredFAQs.length} results)
                    </span>
                  )}
                </h2>
              </div>

              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {faq.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}

                {filteredFAQs.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No results found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or browse all categories
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Contact Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" placeholder="Your full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="portfolio">Portfolio Builder</SelectItem>
                        <SelectItem value="resume">Resume Analysis</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Questions</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question or issue in detail..."
                      rows={6}
                      className="resize-vertical"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Response Time:</strong> We typically respond within 24 hours during business days. 
                    For urgent issues, please email us directly at support@yourplatform.com
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Guides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Feature Guides</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">AI Portfolio Builder</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn how to create stunning portfolio websites with our AI assistant
                    </p>
                    <Button variant="outline" size="sm">View Guide</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Resume ATS Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Understand how to optimize your resume for ATS systems
                    </p>
                    <Button variant="outline" size="sm">View Guide</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Job Tracking</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Organize and track your job applications effectively
                    </p>
                    <Button variant="outline" size="sm">View Guide</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Account Settings</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage your account, privacy, and notification preferences
                    </p>
                    <Button variant="outline" size="sm">View Guide</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
