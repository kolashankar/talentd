import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import { JobCard } from "@/components/job-card";
import { JobDetailsModal } from "@/components/job-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Clock,
  Building,
  Filter,
  X
} from "lucide-react";
import { FAQSection, jobsFAQs } from "@/components/faq-section";
import { SEOKeywords } from "@/components/seo-keywords"; // Assuming SEOKeywords component is available

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const allJobs = jobs || [];

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const locations = Array.from(new Set(allJobs.map(job => job.location).filter(Boolean) as string[]));
    const companies = Array.from(new Set(allJobs.map(job => job.company).filter(Boolean)));
    const skills = Array.from(new Set(allJobs.flatMap(job => job.skills || [])));
    const experienceLevels = Array.from(new Set(allJobs.map(job => job.experienceLevel).filter(Boolean)));
    const jobTypes = Array.from(new Set(allJobs.map(job => job.jobType).filter(Boolean)));

    return { locations, companies, skills, experienceLevels, jobTypes };
  }, [allJobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = allJobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation = !locationFilter || locationFilter === "all" || job.location === locationFilter;
      const matchesCompany = !companyFilter || companyFilter === "all" || job.company === companyFilter;
      const matchesExperience = !experienceFilter || experienceFilter === "all" || job.experienceLevel === experienceFilter;
      const matchesJobType = !jobTypeFilter || jobTypeFilter === "all" || job.jobType === jobTypeFilter;
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.some(skill => job.skills?.includes(skill));

      return matchesSearch && matchesLocation && matchesCompany && 
             matchesExperience && matchesJobType && matchesSkills;
    });

    // Sort jobs
    switch (sortBy) {
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
      case "oldest":
        return filtered.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
      case "company":
        return filtered.sort((a, b) => a.company.localeCompare(b.company));
      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [jobs, searchTerm, locationFilter, companyFilter, experienceFilter, jobTypeFilter, selectedSkills, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setCompanyFilter("");
    setExperienceFilter("");
    setJobTypeFilter("");
    setSelectedSkills([]);
    setSalaryRange([0, 1000000]);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
              Fresher Jobs
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing entry-level opportunities at top companies
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-12 h-12 text-lg"
                  data-testid="search-input"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-2"
                  data-testid="filter-toggle"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6" data-testid="filters-sidebar">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="clear-filters">
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger data-testid="location-filter">
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any location</SelectItem>
                        {filterOptions.locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company</label>
                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger data-testid="company-filter">
                        <SelectValue placeholder="Any company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any company</SelectItem>
                        {filterOptions.companies.map(company => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger data-testid="experience-filter">
                        <SelectValue placeholder="Any level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any level</SelectItem>
                        {filterOptions.experienceLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                      <SelectTrigger data-testid="job-type-filter">
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any type</SelectItem>
                        {filterOptions.jobTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skills</label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filterOptions.skills.slice(0, 20).map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => toggleSkill(skill)}
                            data-testid={`skill-${skill}`}
                          />
                          <label htmlFor={skill} className="text-sm">{skill}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Jobs List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold" data-testid="results-count">
                  {filteredJobs.length} Jobs Found
                </h2>
                {(searchTerm || locationFilter || companyFilter || experienceFilter || jobTypeFilter || selectedSkills.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchTerm && (
                      <Badge variant="secondary">
                        Search: {searchTerm}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchTerm("")} />
                      </Badge>
                    )}
                    {locationFilter && (
                      <Badge variant="secondary">
                        Location: {locationFilter}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setLocationFilter("")} />
                      </Badge>
                    )}
                    {selectedSkills.map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48" data-testid="sort-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="company">Company A-Z</SelectItem>
                    <SelectItem value="title">Job Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-20"></div>
                            <div className="h-3 bg-muted rounded w-16"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              /* No Results */
              <div className="text-center py-16">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or clearing filters
                </p>
                <Button onClick={clearFilters} data-testid="clear-filters-empty">
                  Clear all filters
                </Button>
              </div>
            ) : (
              /* Jobs Grid */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="jobs-grid">
                {filteredJobs.map((job, index) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    onViewDetails={handleViewDetails}
                    data-testid={`job-card-${job.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* SEO Keywords Section */}
      <div className="container mx-auto px-4 py-8">
        <SEOKeywords 
          keywords={[
            "fresher jobs 2024",
            "entry level jobs",
            "graduate jobs India",
            "campus placements",
            "tech jobs for freshers",
            "software engineer fresher",
            "IT jobs fresher",
            "work from home jobs",
            "remote jobs India",
            "startup jobs fresher",
            "MNC jobs India",
            "engineering jobs fresher",
            "developer jobs fresher"
          ]}
          title="Popular Job Searches"
        />
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12">
        <FAQSection faqs={jobsFAQs} />
      </div>
    </div>
  );
}