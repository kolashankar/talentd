import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  LayoutDashboard,
  Code,
  BookOpen,
  Building2,
  FileText,
  TrendingUp,
  Search // Import Search icon
} from "lucide-react";
import { Input } from "@/components/ui/input"; // Import Input component
import { useState } from 'react'; // Import useState hook

interface DsaCompany {
  id: number;
  name: string;
  logo?: string;
  problemCount?: number;
  isPublished: boolean;
}

// Define interface for DsaProblem, assuming it has companyIds and difficulty
interface DsaProblem {
  id: number;
  companyIds?: number[];
  difficulty?: string;
  // other problem properties...
}


export default function DsaCompanies() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: companies = [], isLoading } = useQuery<DsaCompany[]>({ 
    queryKey: ['/api/dsa-companies'] 
  });

  const { data: allProblems = [] } = useQuery<DsaProblem[]>({ // Fetch all problems
    queryKey: ['/api/dsa-problems'],
  });

  const totalProblems = companies.reduce((sum, company) => sum + (company.problemCount || 0), 0);
  const topCompaniesCount = companies.filter(c => (c.problemCount || 0) > 100).length;
  const avgProblems = companies.length > 0 ? Math.floor(totalProblems / companies.length) : 0;

  // Calculate difficulty counts for each company
  const companiesWithStats = companies.map((company: DsaCompany) => {
    const companyProblems = allProblems.filter((p: DsaProblem) => 
      p.companyIds?.includes(company.id)
    );

    return {
      ...company,
      easyCount: companyProblems.filter((p: DsaProblem) => p.difficulty === 'easy').length,
      mediumCount: companyProblems.filter((p: DsaProblem) => p.difficulty === 'medium').length,
      hardCount: companyProblems.filter((p: DsaProblem) => p.difficulty === 'hard').length,
    };
  });

  // Filter companies based on difficulty and search
  const filteredCompanies = companiesWithStats.filter((company: any) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || 
      (difficultyFilter === 'easy' && company.easyCount > 0) ||
      (difficultyFilter === 'medium' && company.mediumCount > 0) ||
      (difficultyFilter === 'hard' && company.hardCount > 0);

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background" data-testid="dsa-companies-page">
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-dashboard">
              <Link href="/dsa-corner">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-questions">
              <Link href="/dsa-corner/questions">
                <Code className="h-4 w-4 mr-2" />
                Questions
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-topics">
              <Link href="/dsa-corner/topics">
                <BookOpen className="h-4 w-4 mr-2" />
                Topics
              </Link>
            </Button>
            <Button 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap" 
              asChild
              data-testid="button-nav-companies"
            >
              <Link href="/dsa-corner/companies">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Link>
            </Button>
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-sheets">
              <Link href="/dsa-corner/sheets">
                <FileText className="h-4 w-4 mr-2" />
                Sheets
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Header Section - Blue Theme */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">Companies & Interview Questions</h1>
          <p className="text-xl text-blue-50" data-testid="text-page-subtitle">
            Practice problems asked by {companies.length} top tech companies
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-stat-companies">{companies.length}</div>
              <div className="text-sm text-muted-foreground mt-2">Companies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-stat-problems">{totalProblems}</div>
              <div className="text-sm text-muted-foreground mt-2">Problems</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-stat-top">{topCompaniesCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Top Companies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-stat-avg">{avgProblems}</div>
              <div className="text-sm text-muted-foreground mt-2">Avg Questions</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={difficultyFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('all')}
              className={difficultyFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              All
            </Button>
            <Button
              variant={difficultyFilter === 'easy' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('easy')}
              className={difficultyFilter === 'easy' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Easy
            </Button>
            <Button
              variant={difficultyFilter === 'medium' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('medium')}
              className={difficultyFilter === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            >
              Medium
            </Button>
            <Button
              variant={difficultyFilter === 'hard' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('hard')}
              className={difficultyFilter === 'hard' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Hard
            </Button>
          </div>
        </div>

        {/* Companies Grid */}
        <div>
          <h3 className="text-2xl font-bold mb-6">All Companies ({filteredCompanies.length})</h3>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || difficultyFilter !== 'all' 
                    ? 'No companies match your filters. Try adjusting your search.'
                    : 'No companies available yet. Check back later!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompanies.map((company: any) => (
                <Link key={company.id} href={`/dsa-corner/companies/${company.id}`}>
                  <Card 
                    className="hover-elevate active-elevate-2 transition-all cursor-pointer h-full" 
                    data-testid={`card-company-${company.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      {company.logo ? (
                        <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center p-2">
                          <img 
                            src={company.logo} 
                            alt={company.name} 
                            className="max-w-full max-h-full object-contain"
                            data-testid={`img-company-logo-${company.id}`}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-white" />
                        </div>
                      )}
                      <h4 className="font-bold text-lg mb-2" data-testid={`text-company-name-${company.id}`}>
                        {company.name}
                      </h4>
                      <div className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {company.problemCount || 0} problems
                      </div>
                      <div className="flex items-center justify-center gap-3 text-xs">
                        {company.easyCount > 0 && (
                          <span className="text-green-600 dark:text-green-400">
                            {company.easyCount} Easy
                          </span>
                        )}
                        {company.mediumCount > 0 && (
                          <span className="text-yellow-600 dark:text-yellow-400">
                            {company.mediumCount} Medium
                          </span>
                        )}
                        {company.hardCount > 0 && (
                          <span className="text-red-600 dark:text-red-400">
                            {company.hardCount} Hard
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}