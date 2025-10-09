import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Calendar, DollarSign, GraduationCap, MapPin } from "lucide-react";

interface Scholarship {
  id: number;
  title: string;
  description: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
  applicationUrl?: string;
  country?: string;
  field?: string;
  level?: string;
}

export default function ScholarshipDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: scholarship, isLoading, error } = useQuery<Scholarship>({
    queryKey: [`/api/scholarships/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Scholarship not found</h2>
          <p className="text-muted-foreground mb-6">The scholarship you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/scholarships')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Scholarships
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => setLocation('/scholarships')}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Scholarships
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-scholarship-title">{scholarship.title}</h1>
          <p className="text-xl text-primary-foreground/80" data-testid="text-scholarship-provider">
            by {scholarship.provider}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">{scholarship.amount}</div>
              <div className="text-sm text-muted-foreground">Award Amount</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">{scholarship.deadline}</div>
              <div className="text-sm text-muted-foreground">Deadline</div>
            </CardContent>
          </Card>

          {scholarship.country && (
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-semibold">{scholarship.country}</div>
                <div className="text-sm text-muted-foreground">Location</div>
              </CardContent>
            </Card>
          )}

          {scholarship.level && (
            <Card>
              <CardContent className="p-4 text-center">
                <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-semibold">{scholarship.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">About This Scholarship</h2>
            <p className="text-muted-foreground whitespace-pre-line" data-testid="text-scholarship-description">
              {scholarship.description}
            </p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Eligibility Criteria</h2>
            <p className="text-muted-foreground whitespace-pre-line" data-testid="text-scholarship-eligibility">
              {scholarship.eligibility}
            </p>
          </CardContent>
        </Card>

        {/* Field of Study */}
        {scholarship.field && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Field of Study</h2>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {scholarship.field}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Apply Button */}
        {scholarship.applicationUrl && (
          <div className="text-center">
            <Button size="lg" asChild data-testid="button-apply">
              <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Apply Now
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
