
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

export const DashboardRouter = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('DashboardRouter - user:', user?.email);
    console.log('DashboardRouter - role:', role);
    console.log('DashboardRouter - authLoading:', authLoading);
    console.log('DashboardRouter - roleLoading:', roleLoading);

    // Wait for both auth and role to load
    if (authLoading || roleLoading) {
      return;
    }

    // If no user, redirect to auth
    if (!user) {
      navigate("/auth");
      return;
    }

    // Route based on role - fixed routing logic
    if (role === 'super_admin') {
      console.log('Redirecting to super admin dashboard');
      navigate("/super-admin-dashboard", { replace: true });
    } else if (role === 'tutor') {
      console.log('Redirecting to tutor dashboard');
      navigate("/tutor-dashboard", { replace: true });
    } else if (role === 'student') {
      console.log('Redirecting to student dashboard');
      navigate("/student-dashboard", { replace: true });
    } else {
      // Default fallback for any other role or undefined role
      console.log('Unknown role, redirecting to student dashboard as fallback');
      navigate("/student-dashboard", { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return null;
};
