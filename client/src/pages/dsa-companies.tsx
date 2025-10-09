import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, TrendingUp } from "lucide-react";

interface DsaCompany {
  id: number;
  name: string;
  logo?: string;
  problemCount?: number;
  isPublished: boolean;
}

export default function DsaCompanies() {
  const { data: companies = [], isLoading } = useQuery<DsaCompany[]>({ 
    queryKey: ['/api/dsa-companies'] 
  });

  const totalProblems = companies.reduce((sum, company) => sum + (company.problemCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Companies
          </h1>
          <p className="text-xl text-blue-700 dark:text-blue-300">
            Practice problems from {companies.length}+ top tech companies
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <Link href="/dsa-corner">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link href="/dsa-corner/questions">
            <Button variant="outline">Questions</Button>
          </Link>
          <Link href="/dsa-corner/topics">
            <Button variant="outline">Topics</Button>
          </Link>
          <Link href="/dsa-corner/companies">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Companies
            </Button>
          </Link>
          <Link href="/dsa-corner/sheets">
            <Button variant="outline">Sheets</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{companies.length}</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </CardContent>
          </Card>
          <Card className="border-indigo-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{totalProblems}</div>
              <div className="text-sm text-muted-foreground">Total Problems</div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Grid */}
        <div>
          <h3 className="text-xl font-bold mb-6">All Companies ({companies.length})</h3>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading companies...</div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No companies found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {companies.map((company) => (
                <Link key={company.id} href={`/dsa-corner/companies/${company.id}`}>
                  <Card className="border-2 border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600 transition-all cursor-pointer h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      {company.logo ? (
                        <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center p-2">
                          <img 
                            src={company.logo} 
                            alt={company.name} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-white" />
                        </div>
                      )}
                      <h4 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-100">
                        {company.name}
                      </h4>
                      <div className="flex items-center text-sm text-blue-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {company.problemCount || 0} problems
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