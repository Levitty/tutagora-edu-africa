
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, RefreshCw } from "lucide-react";
import { forceAuthRefresh } from "@/components/auth/AuthCleanup";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-2" />
            <CardTitle className="text-3xl">TUTAGORA</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Your gateway to personalized learning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowLogin(true)}
          >
            Sign In
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={() => setShowSignUp(true)}
          >
            Create Account
          </Button>
          
          {/* Debug button for clearing auth state */}
          <Button 
            variant="ghost" 
            className="w-full text-xs" 
            size="sm"
            onClick={forceAuthRefresh}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Clear Auth & Refresh
          </Button>
        </CardContent>
      </Card>

      <LoginModal 
        open={showLogin} 
        onOpenChange={setShowLogin}
      />
      <SignUpModal 
        open={showSignUp} 
        onOpenChange={setShowSignUp}
      />
    </div>
  );
};

export default Auth;
