
import { Job } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  ExternalLink,
  Calendar,
  Star,
  Award,
  Target
} from "lucide-react";

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
  if (!job) return null;

  const handleApplyNow = () => {
    if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
    } else if (job.companyWebsite) {
      window.open(job.companyWebsite, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
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
                <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
                <p className="text-lg text-muted-foreground">{job.company}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salaryRange}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{job.jobType}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {job.companyWebsite && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(job.companyWebsite, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Company Website
                </Button>
              )}
              <Button onClick={handleApplyNow}>
                Apply Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Job Meta */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{job.category}</Badge>
            <Badge variant="outline">{job.experienceLevel}</Badge>
            <Badge variant="outline">{job.jobType}</Badge>
            {job.isActive && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Job Description
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Key Responsibilities
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line text-muted-foreground">{job.responsibilities}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Requirements
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-muted-foreground">{job.requirements}</p>
            </div>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Benefits */}
          {job.benefits && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Benefits & Perks</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line text-muted-foreground">{job.benefits}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Posted on {formatDate(job.createdAt!)}</span>
            </div>
            
            <div className="flex space-x-2">
              {job.sourceUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(job.sourceUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Source
                </Button>
              )}
              <Button onClick={handleApplyNow} size="lg">
                Apply Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
