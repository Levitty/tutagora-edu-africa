
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut } from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold">TUTAGORA</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Learning Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover personalized tutoring and AI-powered learning experiences
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Button 
              size="lg" 
              className="h-32 flex flex-col items-center justify-center"
              onClick={() => navigate("/student-dashboard")}
            >
              <BookOpen className="h-8 w-8 mb-2" />
              Student Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-32 flex flex-col items-center justify-center"
              onClick={() => navigate("/browse-tutors")}
            >
              <BookOpen className="h-8 w-8 mb-2" />
              Browse Tutors
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-32 flex flex-col items-center justify-center"
              onClick={() => navigate("/ai-learning")}
            >
              <BookOpen className="h-8 w-8 mb-2" />
              AI Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
