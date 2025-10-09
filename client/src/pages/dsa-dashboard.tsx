import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Code, 
  BookOpen, 
  Building2, 
  FileText,
  ArrowRight,
  LayoutDashboard
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

export default function DsaDashboard() {
  const { data: topics = [] } = useQuery<DsaTopic[]>({ queryKey: ['/api/dsa-topics'] });
  const { data: companies = [] } = useQuery<DsaCompany[]>({ queryKey: ['/api/dsa-companies'] });
  const { data: problems = [] } = useQuery<any[]>({ queryKey: ['/api/dsa-problems'] });
  const { data: sheets = [] } = useQuery<DsaSheet[]>({ queryKey: ['/api/dsa-sheets'] });

  const totalProblems = problems.length;
  const topicsCount = topics.length;
  const companiesCount = companies.length;
  const sheetsCount = sheets.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            <Link href="/dsa-corner">
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dsa-corner/questions">
              <Button variant="ghost" className="whitespace-nowrap">
                <Code className="h-4 w-4 mr-2" />
                Questions
              </Button>
            </Link>
            <Link href="/dsa-corner/topics">
              <Button variant="ghost" className="whitespace-nowrap">
                <BookOpen className="h-4 w-4 mr-2" />
                Topics
              </Button>
            </Link>
            <Link href="/dsa-corner/companies">
              <Button variant="ghost" className="whitespace-nowrap">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Button>
            </Link>
            <Link href="/dsa-corner/sheets">
              <Button variant="ghost" className="whitespace-nowrap">
                <FileText className="h-4 w-4 mr-2" />
                Sheets
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">DSA Corner</h1>
          <p className="text-xl text-orange-100">
            Master Data Structures & Algorithms with {totalProblems.toLocaleString()}+ coding problems
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500">{totalProblems.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Problems</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500">{topicsCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Topics</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500">{companiesCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Companies</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500">{sheetsCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Study Sheets</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dsa-corner/questions">
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer h-full group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Code className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Problems</h3>
                <p className="text-sm text-muted-foreground mb-4">Practice coding</p>
                <Button variant="ghost" className="text-orange-600 group-hover:text-orange-700">
                  Browse all problems <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dsa-corner/topics">
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer h-full group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Topics</h3>
                <p className="text-sm text-muted-foreground mb-4">By category</p>
                <Button variant="ghost" className="text-orange-600 group-hover:text-orange-700">
                  Explore topics <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dsa-corner/companies">
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer h-full group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Companies</h3>
                <p className="text-sm text-muted-foreground mb-4">Interview prep</p>
                <Button variant="ghost" className="text-orange-600 group-hover:text-orange-700">
                  Company questions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dsa-corner/sheets">
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer h-full group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Sheets</h3>
                <p className="text-sm text-muted-foreground mb-4">Study guides</p>
                <Button variant="ghost" className="text-orange-600 group-hover:text-orange-700">
                  Practice sheets <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}