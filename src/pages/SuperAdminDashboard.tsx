
import { useAuth } from "@/hooks/useAuth";
import { useIsSuperAdmin } from "@/hooks/useRole";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const SuperAdminDashboardPage = () => {
  const { user, loading } = useAuth();
  const isSuperAdmin = useIsSuperAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
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
            <p>You must be logged in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSuperAdmin) {
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
            <p>You do not have permission to access the Super Admin Dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <SuperAdminDashboard />;
};

export default SuperAdminDashboardPage;
