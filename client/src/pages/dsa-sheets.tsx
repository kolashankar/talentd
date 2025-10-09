import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, User, TrendingUp, Users, LayoutDashboard, Code, BookOpen, Building2 } from "lucide-react";

interface DsaSheet {
  id: number;
  name: string;
  description?: string;
  creator: string;
  type: "official" | "public" | "community";
  problemCount?: number;
  followerCount?: number;
  isPublished: boolean;
}

export default function DsaSheets() {
  const { data: sheets = [], isLoading } = useQuery<DsaSheet[]>({
    queryKey: ["/api/dsa-sheets"],
  });

  const officialSheets = sheets.filter((s) => s.type === "official");
  const communitySheets = sheets.filter(
    (s) => s.type === "community" || s.type === "public",
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "official":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      case "community":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
      case "public":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Study Sheets
          </h1>
          <p className="text-xl text-blue-700 dark:text-blue-300">
            Curated problem sets and study guides from {sheets.length}+ sources
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
            <Button variant="outline">Companies</Button>
          </Link>
          <Link href="/dsa-corner/sheets">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Sheets
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {sheets.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Sheets</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {officialSheets.length}
              </div>
              <div className="text-sm text-muted-foreground">Official</div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {communitySheets.length}
              </div>
              <div className="text-sm text-muted-foreground">Community</div>
            </CardContent>
          </Card>
        </div>

        {/* Official Sheets */}
        {officialSheets.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">
              Official Sheets ({officialSheets.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {officialSheets.map((sheet) => (
                <Link key={sheet.id} href={`/dsa-corner/sheets/${sheet.id}`}>
                  <Card className="border-2 border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600 transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-100">
                            {sheet.name}
                          </h4>
                          <Badge className={getTypeColor(sheet.type)}>
                            {sheet.type}
                          </Badge>
                        </div>
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      {sheet.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {sheet.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-blue-600">
                          <User className="h-4 w-4 mr-1" />
                          {sheet.creator}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-muted-foreground">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {sheet.problemCount || 0} problems
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-1" />
                            {sheet.followerCount || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Community Sheets */}
        {communitySheets.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">
              Community Sheets ({communitySheets.length})
            </h3>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading sheets...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communitySheets.map((sheet) => (
                  <Link key={sheet.id} href={`/dsa-corner/sheets/${sheet.id}`}>
                    <Card className="border-2 border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600 transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-2 text-purple-900 dark:text-purple-100">
                              {sheet.name}
                            </h4>
                            <Badge className={getTypeColor(sheet.type)}>
                              {sheet.type}
                            </Badge>
                          </div>
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        {sheet.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {sheet.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-purple-600">
                            <User className="h-4 w-4 mr-1" />
                            {sheet.creator}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center text-muted-foreground">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {sheet.problemCount || 0} problems
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              {sheet.followerCount || 0}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {!isLoading && sheets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No sheets found
          </div>
        )}
      </div>
    </div>
  );
}