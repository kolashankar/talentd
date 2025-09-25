import { Job } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, DollarSign, Clock, ArrowRight, Eye, ExternalLink } from "lucide-react";

interface JobCardProps {
  job: Job;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
  onViewDetails?: (job: Job) => void;
}

export function JobCard({ job, className, style, 'data-testid': testId, onViewDetails }: JobCardProps) {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'internship':
        return <Badge variant="secondary" className="bg-accent/20 text-accent">Internship</Badge>;
      case 'fresher-job':
        return <Badge variant="default" className="bg-primary/20 text-primary">Fresher</Badge>;
      default:
        return <Badge variant="outline">Job</Badge>;
    }
  };

  const getExperienceBadge = (level: string) => {
    switch (level) {
      case 'fresher':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Fresher</Badge>;
      case 'entry':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Entry Level</Badge>;
      case 'junior':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Junior</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getJobTypeBadge = (type: string) => {
    const colors = {
      'full-time': 'bg-primary/20 text-primary',
      'part-time': 'bg-secondary/20 text-secondary',
      'contract': 'bg-orange-100 text-orange-800',
      'internship': 'bg-accent/20 text-accent'
    };
    
    return (
      <Badge 
        variant="secondary" 
        className={colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground'}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all transform hover:-translate-y-1 card-hover",
        className
      )}
      style={style}
      data-testid={testId}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Company Logo */}
          <div className="flex items-center space-x-3">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={`${job.company} logo`}
                className="w-12 h-12 rounded-lg object-contain"
                data-testid={`${testId}-logo`}
                onError={(e) => {
                  // Fallback to clearbit logo service
                  const img = e.target as HTMLImageElement;
                  img.src = `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`;
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">
                  {job.company.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground" data-testid={`${testId}-company`}>
                {job.company}
              </p>
              {getCategoryBadge(job.category)}
            </div>
          </div>
          
          {/* Job Type Badge */}
          {getExperienceBadge(job.experienceLevel)}
        </div>

        {/* Job Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`${testId}-title`}>
          {job.title}
        </h3>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span data-testid={`${testId}-location`}>{job.location}</span>
          </div>
          
          {job.salaryRange && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span data-testid={`${testId}-salary`}>{job.salaryRange}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span data-testid={`${testId}-type`}>{job.jobType}</span>
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  data-testid={`${testId}-skill-${index}`}
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {getJobTypeBadge(job.jobType)}
            {job.isActive && (
              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                Active
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails?.(job)}
              data-testid={`${testId}-view-details-button`}
            >
              <Eye className="mr-1 h-4 w-4" />
              View Details
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => {
                if (job.applicationUrl) {
                  window.open(job.applicationUrl, '_blank');
                } else if (job.companyWebsite) {
                  window.open(job.companyWebsite, '_blank');
                }
              }}
              className="text-primary-foreground"
              data-testid={`${testId}-apply-button`}
            >
              Apply Now
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Posted Date */}
        <div className="mt-3 text-xs text-muted-foreground" data-testid={`${testId}-posted-date`}>
          Posted {new Date(job.createdAt!).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
