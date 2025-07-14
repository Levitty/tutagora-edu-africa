
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, Award, Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !roleLoading && user && userRole) {
      // Redirect authenticated users to their appropriate dashboard
      if (userRole === 'student') {
        navigate('/student-dashboard');
      } else if (userRole === 'tutor') {
        navigate('/tutor-dashboard');
      } else if (userRole === 'super_admin') {
        navigate('/super-admin-dashboard');
      } else if (userRole === 'institution') {
        navigate('/institution-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  }, [user, userRole, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TUTAGORA</h1>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Learn Anything, Teach Everything
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with expert tutors, join institutions for certificate courses, or share your knowledge with students worldwide.
        </p>
        <Button size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/auth')}>
          Start Learning Today
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Choose Your Learning Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>For Students</CardTitle>
              <CardDescription>
                Learn from expert tutors with personalized 1-on-1 sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• AI-powered learning recommendations</li>
                <li>• Live video sessions with tutors</li>
                <li>• Progress tracking and certificates</li>
                <li>• Affordable pricing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>For Tutors</CardTitle>
              <CardDescription>
                Share your expertise and earn money teaching students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Set your own hourly rates</li>
                <li>• Flexible scheduling</li>
                <li>• Integrated payment system</li>
                <li>• Course creation tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>For Institutions</CardTitle>
              <CardDescription>
                Offer accredited certificate courses to students globally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Group enrollment management</li>
                <li>• Certificate issuance</li>
                <li>• Revenue analytics</li>
                <li>• Accreditation support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of learners and educators on TUTAGORA</p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-semibold">TUTAGORA</span>
          </div>
          <p className="text-gray-400">
            © 2024 TUTAGORA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
