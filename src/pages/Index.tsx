
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User, GraduationCap, Users, Star, ArrowRight, Play, CheckCircle, Globe, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleAuthenticatedAction = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/auth");
    }
  };

  const getDashboardRoute = () => {
    if (profile?.user_type === 'tutor') {
      return "/tutor-dashboard";
    }
    return "/student-dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">TUTAGORA</h1>
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="animate-pulse flex space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {profile?.first_name || user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(getDashboardRoute())}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  My Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/auth")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Africa's Premier Learning Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with expert tutors across Africa, master subjects with AI-powered adaptive learning games, 
            and transform your educational journey with personalized, interactive experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/browse-tutors")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Users className="h-5 w-5" />
              Explore Tutors
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleAuthenticatedAction("/ai-learning")}
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <GraduationCap className="h-5 w-5" />
              Try AI Learning
              <Play className="h-4 w-4" />
            </Button>
          </div>

          {/* Demo Video or Interactive Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">See TUTAGORA in Action</h3>
                <p className="text-blue-100">Interactive learning experience awaits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Expert African Tutors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Connect with qualified, vetted tutors from across Africa for personalized one-on-one sessions tailored to your learning goals.
              </p>
              <Button variant="outline" onClick={() => navigate("/browse-tutors")} className="w-full">
                Browse Tutors
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">AI Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Engage with intelligent games that adapt to your learning pace, style, and progress across multiple subjects and difficulty levels.
              </p>
              <Button 
                variant="outline" 
                onClick={() => handleAuthenticatedAction("/ai-learning")}
                className="w-full"
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Comprehensive Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access expertly designed courses covering primary, secondary, and university-level subjects with interactive content.
              </p>
              <Button variant="outline" onClick={() => navigate("/course-dashboard")} className="w-full">
                Explore Courses
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose TUTAGORA Section */}
        <div className="bg-white rounded-2xl p-12 mb-16 shadow-lg">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TUTAGORA?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Pan-African Network</h4>
                <p className="text-gray-600">Connect with educators and learners across the entire African continent.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Verified Tutors</h4>
                <p className="text-gray-600">All tutors undergo thorough KYC verification and qualification checks.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Proven Results</h4>
                <p className="text-gray-600">Track your progress with detailed analytics and achievement systems.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-16 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-blue-100">Expert Tutors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25,000+</div>
              <div className="text-blue-100">Students Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">54</div>
              <div className="text-blue-100">African Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Student Testimonials */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Success Stories from Across Africa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The AI learning games made chemistry so engaging! I improved my WAEC grades from C to A1."
                </p>
                <div className="text-sm text-gray-500">- Amina K., Lagos, Nigeria</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Found an amazing physics tutor who helped me excel in my A-levels. Now studying engineering!"
                </p>
                <div className="text-sm text-gray-500">- Joseph M., Nairobi, Kenya</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a tutor, TUTAGORA connected me with amazing students. I love the teaching tools!"
                </p>
                <div className="text-sm text-gray-500">- Dr. Sarah O., Cape Town, South Africa</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subject Areas */}
        <div className="bg-white rounded-2xl p-12 mb-16 shadow-lg">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Master Any Subject
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { name: "Mathematics", icon: "📐" },
              { name: "Physics", icon: "⚡" },
              { name: "Chemistry", icon: "🧪" },
              { name: "Biology", icon: "🔬" },
              { name: "English", icon: "📚" },
              { name: "History", icon: "🏛️" }
            ].map((subject) => (
              <div key={subject.name} className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-2">{subject.icon}</div>
                <div className="font-medium text-gray-900">{subject.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="py-16 px-8">
              <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Join thousands of students and tutors who are already part of Africa's fastest-growing educational community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-3"
                >
                  Start Learning Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
                  onClick={() => navigate("/browse-tutors")}
                >
                  Browse Tutors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold">TUTAGORA</span>
              </div>
              <p className="text-gray-400">
                Empowering education across Africa through technology and human connection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/browse-tutors" className="hover:text-white">Find Tutors</a></li>
                <li><a href="#" onClick={() => handleAuthenticatedAction("/ai-learning")} className="hover:text-white">AI Learning</a></li>
                <li><a href="/course-dashboard" className="hover:text-white">Courses</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Tutors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/auth" className="hover:text-white">Become a Tutor</a></li>
                <li><a href="#" onClick={() => handleAuthenticatedAction("/tutor-dashboard")} className="hover:text-white">Tutor Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TUTAGORA. All rights reserved. Made with ❤️ for Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
