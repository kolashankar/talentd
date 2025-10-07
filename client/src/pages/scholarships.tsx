
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  GraduationCap,
  Calendar,
  DollarSign,
  ExternalLink,
  Filter,
  Star,
  School
} from "lucide-react";

interface Scholarship {
  id: number;
  title: string;
  description: string;
  provider: string;
  amount: string;
  educationLevel: string;
  eligibility: string;
  deadline?: string;
  applicationUrl?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
}

export default function Scholarships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [educationLevelFilter, setEducationLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  const { data: scholarships = [], isLoading } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships'],
  });

  const educationLevels = [
    { value: 'upto-10th', label: 'Upto 10th Class' },
    { value: '12th', label: '12th Pass / Pursuing' },
    { value: 'btech', label: 'B.Tech / Engineering' },
    { value: 'degree', label: 'Degree / Graduation' },
    { value: 'postgrad', label: 'Post Graduation' },
  ];

  const filteredScholarships = useMemo(() => {
    let filtered = scholarships.filter(scholarship => {
      const matchesSearch = !searchTerm || 
        scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEducationLevel = !educationLevelFilter || educationLevelFilter === "all" || 
        scholarship.educationLevel === educationLevelFilter;

      const matchesCategory = !categoryFilter || categoryFilter === "all" || 
        scholarship.category === categoryFilter;

      return matchesSearch && matchesEducationLevel && matchesCategory;
    });

    switch (sortBy) {
      case "deadline":
        return filtered.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
      case "amount-high":
        return filtered.sort((a, b) => {
          const aAmount = parseInt(a.amount.replace(/[^0-9]/g, '')) || 0;
          const bAmount = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
          return bAmount - aAmount;
        });
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return filtered;
    }
  }, [scholarships, searchTerm, educationLevelFilter, categoryFilter, sortBy]);

  const getEducationLevelLabel = (level: string) => {
    return educationLevels.find(l => l.value === level)?.label || level;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Scholarships</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find financial aid opportunities for your education journey
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships by title, provider, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-12 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-80 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Education Level</label>
                  <Select value={educationLevelFilter} onValueChange={setEducationLevelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {educationLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="merit">Merit Based</SelectItem>
                      <SelectItem value="need">Need Based</SelectItem>
                      <SelectItem value="minority">Minority</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {filteredScholarships.length} Scholarships Found
              </h2>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline Soon</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredScholarships.length === 0 ? (
              <div className="text-center py-16">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No scholarships found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredScholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{scholarship.title}</h3>
                            {scholarship.featured && (
                              <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-muted-foreground mb-2">{scholarship.provider}</p>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          <School className="h-3 w-3 mr-1" />
                          {getEducationLevelLabel(scholarship.educationLevel)}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {scholarship.description}
                      </p>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">{scholarship.amount}</span>
                        </div>
                        {scholarship.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">
                              Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {scholarship.tags && scholarship.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {scholarship.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <strong>Eligibility:</strong> {scholarship.eligibility.slice(0, 100)}...
                        </div>
                        {scholarship.applicationUrl && (
                          <Button size="sm" asChild>
                            <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                              Apply Now
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
