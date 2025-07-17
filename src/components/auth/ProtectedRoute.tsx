
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'tutor' | 'super_admin';
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useRole();

  console.log('ProtectedRoute - user:', user?.email);
  console.log('ProtectedRoute - userRole:', userRole);
  console.log('ProtectedRoute - requiredRole:', requiredRole);
  console.log('ProtectedRoute - authLoading:', authLoading);
  console.log('ProtectedRoute - roleLoading:', roleLoading);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    console.log('Access denied - wrong role. Expected:', requiredRole, 'Got:', userRole);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to access this page.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Required role: {requiredRole}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Your role: {userRole || 'undefined'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
