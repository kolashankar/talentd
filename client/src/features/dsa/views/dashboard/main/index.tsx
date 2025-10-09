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
  ArrowRight
} from "lucide-react";

interface DsaTopic {
  id: number;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  problemCount?: number;
}

interface DsaCompany {
  id: number;
  name: string;
  logo?: string;
  problemCount?: number;
}

interface DsaSheet {
  id: number;
  name: string;
  creator: string;
  type: 'official' | 'public' | 'community';
  problemCount?: number;
}

export default function DSACorner() {
  const { data: topics = [] } = useQuery<DsaTopic[]>({ queryKey: ['/api/dsa-topics'] });
  const { data: companies = [] } = useQuery<DsaCompany[]>({ queryKey: ['/api/dsa-companies'] });
  const { data: problems = [] } = useQuery<any[]>({ queryKey: ['/api/dsa-problems'] });
  const { data: sheets = [] } = useQuery<DsaSheet[]>({ queryKey: ['/api/dsa-sheets'] });

  const totalProblems = problems.length;
  const topicsCount = topics.length;
  const companiesCount = companies.length;
  const sheetsCount = sheets.length;

  return (
    <div className="min-h-screen bg-background" data-testid="dsa-dashboard">
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            <Button 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap"
              asChild
              data-testid="button-nav-dashboard"
            >
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
            <Button variant="ghost" className="whitespace-nowrap" asChild data-testid="button-nav-companies">
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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">DSA Corner</h1>
          <p className="text-xl text-blue-50" data-testid="text-page-subtitle">
            Master Data Structures & Algorithms with {totalProblems.toLocaleString()}+ coding problems
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-total-problems">{totalProblems.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">Total Problems</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-total-topics">{topicsCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Topics</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-total-companies">{companiesCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Companies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-500" data-testid="text-total-sheets">{sheetsCount}</div>
              <div className="text-sm text-muted-foreground mt-2">Study Sheets</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover-elevate active-elevate-2 transition-all cursor-pointer" asChild data-testid="card-problems">
            <Link href="/dsa-corner/questions">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-4">
                  <Code className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Problems</h3>
                <p className="text-sm text-muted-foreground mb-4">Practice coding</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Browse all problems <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover-elevate active-elevate-2 transition-all cursor-pointer border-blue-200 dark:border-blue-800" asChild data-testid="card-topics">
            <Link href="/dsa-corner/topics">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Topics</h3>
                <p className="text-sm text-muted-foreground mb-4">By category</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Explore topics <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover-elevate active-elevate-2 transition-all cursor-pointer" asChild data-testid="card-companies">
            <Link href="/dsa-corner/companies">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Companies</h3>
                <p className="text-sm text-muted-foreground mb-4">Interview prep</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Company questions <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover-elevate active-elevate-2 transition-all cursor-pointer" asChild data-testid="card-sheets">
            <Link href="/dsa-corner/sheets">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Sheets</h3>
                <p className="text-sm text-muted-foreground mb-4">Study guides</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Practice sheets <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}