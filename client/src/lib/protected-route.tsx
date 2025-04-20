import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { User as SelectUser } from "@shared/schema";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType<any>;
  allowedRoles?: string[];
};

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles,
}: ProtectedRouteProps) {
  const [location] = useLocation();
  
  // Get user data directly from API
  const { 
    data: user, 
    isLoading,
    error,
    isError,
    isFetching
  } = useQuery<SelectUser | null>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    retry: 2,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  if (error) {
    console.error("Error fetching user:", error);
  }

  // Show loading state only on initial load
  if (isLoading && !isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <Route path={path}>
      {(props) => {
        // Only redirect to auth if we're not already on the auth page and there's no user
        if (!user && location !== "/auth") {
          console.log("No user found, redirecting to auth");
          return <Redirect to="/auth" />;
        }
        
        // Check role-based access
        if (user && allowedRoles && !allowedRoles.includes(user.role)) {
          console.log("User role not allowed, redirecting to home");
          return <Redirect to="/" />;
        }
        
        // Render the protected component
        return <Component {...props} />;
      }}
    </Route>
  );
}
