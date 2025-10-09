import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GoogleAuth } from "@/shared/components/business/admin/generators/ai/content/google-auth";
import logoPath from "@assets/logo_1760010369808.png";
import {
  Menu,
  X,
  Briefcase,
  Users,
  MapPin,
  Code,
  FileText,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check authentication status
  const { data: authStatus } = useQuery({
    queryKey: ["/api/auth/status"],
    queryFn: async () => {
      const response = await fetch("/api/auth/status", {
        credentials: "include",
      });
      if (!response.ok) return { authenticated: false };
      return response.json();
    },
  });

  const navItems = [
    { label: "Jobs", path: "/jobs", icon: Briefcase },
    { label: "Internships", path: "/internships", icon: Users },
    { label: "Roadmaps", path: "/roadmaps", icon: MapPin },
    { label: "DSA Corner", path: "/dsa", icon: Code },
    { label: "Articles", path: "/articles", icon: FileText },
  ];

  const secondaryNavItems = [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-1 rounded-md transition-all"
            data-testid="link-home"
          >
            <img 
              src={logoPath} 
              alt="Jobs for Career" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                    data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <Link href="/scholarships">
              <Button
                variant={isActive("/scholarships") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
                data-testid="link-scholarships"
              >
                <MapPin className="h-4 w-4" />
                Scholarships
              </Button>
            </Link>
            {secondaryNavItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {!authStatus?.authenticated && (
              <Link href="/register">
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Button>
              </Link>
            )}
            <GoogleAuth />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-menu-toggle"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <div className="mb-4 space-y-2">
                  {!authStatus?.authenticated && (
                    <Link href="/register">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus className="h-4 w-4" />
                        Register
                      </Button>
                    </Link>
                  )}
                  <GoogleAuth />
                </div>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={isActive(item.path) ? "default" : "ghost"}
                          className="w-full justify-start gap-3"
                          onClick={() => setIsMenuOpen(false)}
                          data-testid={`link-mobile-${item.label.toLowerCase().replace(" ", "-")}`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                  <Link href="/scholarships">
                    <Button
                      variant={isActive("/scholarships") ? "default" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => setIsMenuOpen(false)}
                      data-testid="link-mobile-scholarships"
                    >
                      <MapPin className="h-4 w-4" />
                      Scholarships
                    </Button>
                  </Link>

                  {/* Secondary Nav Items */}
                  <div className="border-t pt-2 mt-2">
                    <Link href="/portfolio">
                      <Button
                        variant={isActive("/portfolio") ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FileText className="h-4 w-4" />
                        Portfolio Builder
                      </Button>
                    </Link>
                    <Link href="/resume-review">
                      <Button
                        variant={
                          isActive("/resume-review") ? "default" : "ghost"
                        }
                        className="w-full justify-start gap-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FileText className="h-4 w-4" />
                        Resume Reviewer
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-green-600"
                      onClick={() => {
                        window.open(
                          "https://whatsapp.com/channel/0029VajVvKSE51Ub6kRq4b06",
                          "_blank",
                        );
                        setIsMenuOpen(false);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Join WhatsApp
                    </Button>
                    {secondaryNavItems.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={isActive(item.path) ? "default" : "ghost"}
                          className="w-full justify-start gap-3"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
