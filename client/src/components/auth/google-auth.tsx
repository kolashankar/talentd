import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GoogleAuthProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  showDialog?: boolean;
  onClose?: () => void;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
}

export function GoogleAuth({ onSuccess, onError, showDialog = false, onClose }: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication status
  const { data: authStatus, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['/api/auth/status'],
    queryFn: async () => {
      const url = `${import.meta.env.VITE_API_URL || ''}/api/auth/status`;
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to check auth status');
      return response.json();
    },
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const url = `${import.meta.env.VITE_API_URL || ''}/api/auth/logout`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/status'] });
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (authStatus?.authenticated && authStatus.user) {
      onSuccess?.(authStatus.user);
    }
  }, [authStatus, onSuccess]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to Google OAuth using relative URL
      const authUrl = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`;
      window.location.href = authUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      onError?.(errorMessage);
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  // If user is authenticated, show user info
  if (authStatus?.authenticated && authStatus.user) {
    const user: AuthUser = authStatus.user;

    const UserCard = () => (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{user.username}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );

    if (showDialog && onClose) {
      return (
        <Dialog open={showDialog} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Account</DialogTitle>
            </DialogHeader>
            <UserCard />
          </DialogContent>
        </Dialog>
      );
    }

    return <UserCard />;
  }

  // Sign-in form
  const SignInCard = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <User className="h-5 w-5" />
          <span>Sign In Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Please sign in to access portfolio builder and resume reviewer features
        </p>
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full"
          variant="default"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign In
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  if (showDialog && onClose) {
    return (
      <Dialog open={showDialog} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <SignInCard />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <SignInCard />;
}

declare global {
  interface Window {
    google?: any;
  }
}