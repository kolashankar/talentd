import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, PenTool, MessageCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function SecondaryNavbar() {
  const [location] = useLocation();

  return (
    <div className="border-b bg-background hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <Link href="/portfolio">
              <Button 
                variant={location === "/portfolio" ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
                data-testid="link-portfolio-builder"
              >
                <PenTool className="h-4 w-4" />
                Portfolio Builder
              </Button>
            </Link>
            <Link href="/resume-review">
              <Button 
                variant={location === "/resume-review" ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
                data-testid="link-resume-reviewer"
              >
                <FileText className="h-4 w-4" />
                Resume Reviewer
              </Button>
            </Link>
          </div>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
            size="sm"
            onClick={() => window.open('https://whatsapp.com/channel/0029VajVvKSE51Ub6kRq4b06', '_blank')}
            data-testid="button-join-whatsapp"
          >
            <SiWhatsapp className="h-4 w-4" />
            Join WhatsApp Community
          </Button>
        </div>
      </div>
    </div>
  );
}
