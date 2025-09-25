import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, LogIn } from "lucide-react";

interface GoogleAuthProps {
  onAuthChange?: (user: any) => void;
}

export function GoogleAuth({ onAuthChange }: GoogleAuthProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id",
          callback: handleCredentialResponse,
        });
      }
    };

    // Check for existing session
    checkAuthStatus();

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        onAuthChange?.(userData);
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
    }
  };

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    try {
      // Instead of posting to API, redirect to Google OAuth flow
      window.location.href = '/api/auth/google';
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    // Redirect to Google OAuth flow
    window.location.href = '/api/auth/google';
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      onAuthChange?.(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
}

declare global {
  interface Window {
    google: any;
  }
}
