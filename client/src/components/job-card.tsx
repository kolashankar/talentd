import { Job } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, DollarSign, Clock, ArrowRight, Eye, ExternalLink, Building2 } from "lucide-react";

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
        return <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">Internship</Badge>;
      case 'fresher-job':
        return <Badge variant="default" className="bg-primary/20 text-primary text-xs">Fresher</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Job</Badge>;
    }
  };

  const getExperienceBadge = (level: string) => {
    switch (level) {
      case 'fresher':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Fresher</Badge>;
      case 'entry':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Entry Level</Badge>;
      case 'junior':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">Junior</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
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
        className={`text-xs ${colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground'}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all transform hover:-translate-y-1 card-hover h-full",
        className
      )}
      style={style}
      data-testid={testId}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          {/* Company Logo */}
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.company} 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Building2 className={`h-6 w-6 text-muted-foreground ${job.companyLogo ? 'hidden' : ''}`} />
          </div>

          {/* Experience Badge */}
          <div className="ml-2 flex-shrink-0">
            {getExperienceBadge(job.experienceLevel)}
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-base font-semibold mb-3 line-clamp-2 leading-tight" data-testid={`${testId}-title`}>
          {job.title}
        </h3>

        {/* Job Details */}
        <div className="space-y-1.5 mb-3 flex-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate" data-testid={`${testId}-location`}>{job.location}</span>
          </div>

          {job.salaryRange && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate" data-testid={`${testId}-salary`}>{job.salaryRange}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate" data-testid={`${testId}-type`}>{job.jobType}</span>
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5"
                  data-testid={`${testId}-skill-${index}`}
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{job.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              {getJobTypeBadge(job.jobType)}
              {job.isActive && (
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                  Active
                </Badge>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails?.(job)}
              data-testid={`${testId}-view-details-button`}
              className="flex-1 text-xs px-2 py-1.5 h-8"
            >
              <Eye className="mr-1 h-3 w-3" />
              Details
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
              className="flex-1 text-xs px-2 py-1.5 h-8"
              data-testid={`${testId}-apply-button`}
            >
              Apply
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Posted Date */}
        <div className="mt-2 text-xs text-muted-foreground" data-testid={`${testId}-posted-date`}>
          Posted {new Date(job.createdAt!).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}