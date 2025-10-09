import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Users, 
  ExternalLink,
  Calendar
} from "lucide-react";
import type { Job } from "@shared/schema";

export default function JobDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: [`/api/jobs/${id}`],
    enabled: !!id,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApplyNow = () => {
    if (job?.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Job not found</h2>
          <p className="text-muted-foreground mb-6">The job posting you're looking for doesn't exist.</p>
          <Link href="/jobs">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {job.companyLogo ? (
                      <img 
                        src={job.companyLogo} 
                        alt={`${job.company} logo`}
                        className="w-16 h-16 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold">{job.title}</h1>
                      <p className="text-xl text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <DollarSign className="h-5 w-5" />
                      <span>{job.salaryRange}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>{job.jobType}</span>
                  </div>
                  {job.experienceLevel && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="h-5 w-5" />
                      <span>{job.experienceLevel}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.category && <Badge variant="secondary">{job.category}</Badge>}
                  {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
                  {job.jobType && <Badge>{job.jobType}</Badge>}
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  {job.description && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                      <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                    </div>
                  )}

                  {job.requirements && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                      <p className="text-muted-foreground whitespace-pre-line">{job.requirements}</p>
                    </div>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="pt-6 space-y-4">
                <Button onClick={handleApplyNow} size="lg" className="w-full">
                  Apply Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <h3 className="font-semibold text-base">Job Information</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-medium">{formatDate(job.createdAt.toString())}</span>
                  </div>

                  {job.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium">{formatDate(job.expiresAt.toString())}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Job Type</span>
                    <span className="font-medium">{job.jobType}</span>
                  </div>

                  {job.experienceLevel && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-medium">{job.experienceLevel}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Share this job with friends who might be interested!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
