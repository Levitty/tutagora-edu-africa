import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useIsSuperAdmin, useIsTutor, useIsStudent } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User, GraduationCap, Users, Star, ArrowRight, Play, CheckCircle, Globe, Award, TrendingUp, Briefcase, Target, Zap, Shield, Clock, UserPlus, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { data: profile } = useProfile();
  const isSuperAdmin = useIsSuperAdmin();
  const isTutor = useIsTutor();
  const isStudent = useIsStudent();
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
    console.log('getDashboardRoute - isSuperAdmin:', isSuperAdmin);
    console.log('getDashboardRoute - isTutor:', isTutor);
    console.log('getDashboardRoute - isStudent:', isStudent);
    
    if (isSuperAdmin) {
      return "/super-admin-dashboard";
    }
    if (isTutor) {
      return "/tutor-dashboard";
    }
    return "/student-dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl mr-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TUTAGORA
                </h1>
                <p className="text-xs text-gray-500">Africa's Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : user ? (
                <>
                  <span className="text-sm text-gray-600 hidden md:block">
                    Welcome, {profile?.first_name || user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(getDashboardRoute())}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
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
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/auth")}
                    className="hidden md:flex"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/auth")}
                    className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    <UserPlus className="h-4 w-4" />
                    Become a Tutor
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Connecting African Learners with Expert Tutors
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Learn from the Best,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Achieve Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Connect with Africa's most qualified tutors for personalized one-on-one learning. 
            Master any subject through expert guidance, interactive AI games, and proven teaching methods. 
            From KCSE preparation to university-level courses - unlock your potential with TUTAGORA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate("/browse-tutors")}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
            >
              <Users className="h-5 w-5" />
              Find Your Perfect Tutor
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleAuthenticatedAction("/ai-learning")}
              className="flex items-center gap-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-4 h-auto"
            >
              <GraduationCap className="h-5 w-5" />
              Try AI Learning
              <Play className="h-5 w-5" />
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,000+</div>
              <div className="text-gray-600 text-sm">Verified Tutors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">25K+</div>
              <div className="text-gray-600 text-sm">Learning Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">54</div>
              <div className="text-gray-600 text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TUTAGORA?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience personalized tutoring that adapts to your learning style, combined with cutting-edge AI technology for accelerated learning outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Expert African Tutors</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Learn from verified tutors across Africa. Our educators are industry professionals, university graduates, and subject matter experts with proven track records.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/browse-tutors")} 
                  className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                >
                  Browse Tutors
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-green-50 to-emerald-100">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">AI-Enhanced Learning</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Complement your tutoring sessions with personalized AI games and adaptive learning. Practice concepts, test knowledge, and reinforce learning between sessions.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => handleAuthenticatedAction("/ai-learning")}
                  className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                >
                  Try AI Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Career-Ready Skills</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Beyond academic excellence, master practical skills for today's job market. From critical thinking to digital literacy - prepare for global opportunities.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => handleAuthenticatedAction("/course-dashboard")}
                  className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors"
                >
                  Explore Skills
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upskilling Section */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl p-12 mb-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">
                Future-Proof Your Career
              </h3>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                The job market is evolving rapidly. Stay ahead with skills that matter in the digital economy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <TrendingUp className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">High-Demand Skills</h4>
                  <p className="text-blue-100">AI, Data Science, Cloud Computing, Digital Marketing</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Target className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Industry Certifications</h4>
                  <p className="text-blue-100">Google, Microsoft, AWS, Meta recognized programs</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Briefcase className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Career Placement</h4>
                  <p className="text-blue-100">Direct connections to top employers across Africa</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/course-dashboard")}
                className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-semibold"
              >
                Start Your Upskilling Journey
              </Button>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="text-center mb-20">
          <h3 className="text-4xl font-bold text-gray-900 mb-8">Success Stories from Across Africa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                  "TUTAGORA's AI learning helped me land a software engineering role at a top tech company. The adaptive games made coding concepts so clear!"
                </p>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Amina K.</div>
                  <div className="text-sm text-gray-600">Software Engineer, Lagos</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                  "From struggling with physics to getting into engineering university - my tutor transformed my understanding completely!"
                </p>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Joseph M.</div>
                  <div className="text-sm text-gray-600">Engineering Student, Nairobi</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic leading-relaxed">
                  "Teaching on TUTAGORA allowed me to reach students across Africa and grow my impact beyond the classroom!"
                </p>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Dr. Sarah O.</div>
                  <div className="text-sm text-gray-600">Mathematics Tutor, Cape Town</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subject Areas */}
        <div className="bg-white rounded-3xl p-12 mb-20 shadow-xl">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Master Any Subject
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { name: "Mathematics", icon: "📐", color: "from-blue-500 to-blue-600" },
              { name: "Physics", icon: "⚡", color: "from-purple-500 to-purple-600" },
              { name: "Chemistry", icon: "🧪", color: "from-green-500 to-green-600" },
              { name: "Biology", icon: "🔬", color: "from-red-500 to-red-600" },
              { name: "English", icon: "📚", color: "from-yellow-500 to-yellow-600" },
              { name: "Programming", icon: "💻", color: "from-indigo-500 to-indigo-600" }
            ].map((subject) => (
              <div key={subject.name} className="group cursor-pointer">
                <div className={`bg-gradient-to-r ${subject.color} p-6 rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl mb-4`}>
                  <div className="text-4xl mb-2">{subject.icon}</div>
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {subject.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* For Tutors Section */}
        <div className="bg-gradient-to-r from-orange-900 via-red-900 to-pink-900 rounded-3xl shadow-2xl p-12 mb-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">
                Share Your Expertise, Earn While Teaching
              </h3>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Join Africa's most innovative tutoring platform. Connect with eager learners, set your own schedule, and make a meaningful impact while earning a competitive income.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Users className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Flexible Teaching</h4>
                  <p className="text-orange-100">Set your own hours, rates, and teaching style</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Award className="h-12 w-12 text-red-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Professional Growth</h4>
                  <p className="text-orange-100">Expand your reach and build your reputation</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <TrendingUp className="h-12 w-12 text-pink-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Competitive Earnings</h4>
                  <p className="text-orange-100">Earn KSh 500-2000+ per hour based on expertise</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-white text-red-900 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-semibold"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Become a TUTAGORA Tutor
              </Button>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden border-0 shadow-2xl">
            <CardContent className="py-20 px-8 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-5xl font-bold mb-6">Ready to Transform Your Future?</h3>
                <p className="text-blue-100 mb-10 max-w-3xl mx-auto text-xl leading-relaxed">
                  Join thousands of learners who are already building the skills that matter. 
                  Your journey to career success starts here.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth")}
                    className="bg-white text-purple-900 hover:bg-gray-100 text-xl px-10 py-5 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Learning Today
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-white border-2 border-white hover:bg-white hover:text-purple-600 text-xl px-10 py-5 h-auto font-semibold"
                    onClick={() => navigate("/browse-tutors")}
                  >
                    Browse Tutors
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl mr-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TUTAGORA</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering Africa's future through innovative education and career-focused learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">For Students</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate("/browse-tutors")} className="hover:text-white transition-colors">Find Tutors</button></li>
                <li><button onClick={() => handleAuthenticatedAction("/ai-learning")} className="hover:text-white transition-colors">AI Learning</button></li>
                <li><button onClick={() => handleAuthenticatedAction("/course-dashboard")} className="hover:text-white transition-colors">Courses</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">For Tutors</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate("/auth")} className="hover:text-white transition-colors">Become a Tutor</button></li>
                <li><button onClick={() => handleAuthenticatedAction("/tutor-dashboard")} className="hover:text-white transition-colors">Tutor Dashboard</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TUTAGORA. All rights reserved. Made with ❤️ for Africa's future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
