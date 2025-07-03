
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Video, Award, Globe, Smartphone, Calendar, Download, Star, Play, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Video className="h-8 w-8 text-blue-600" />,
      title: "Live Tutoring",
      description: "Interactive real-time sessions with expert tutors across Africa"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-500" />,
      title: "Offline Learning",
      description: "Download lessons and study offline in low-connectivity areas"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Expert Tutors",
      description: "Qualified educators from top African universities"
    },
    {
      icon: <Award className="h-8 w-8 text-orange-500" />,
      title: "Exam Prep",
      description: "Specialized preparation for KCSE, JAMB, and other regional exams"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Multi-Language",
      description: "Available in English, Swahili, Yoruba, and more"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-orange-500" />,
      title: "Mobile First",
      description: "Optimized for smartphones and low-bandwidth connections"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Kimani",
      role: "KCSE Student",
      content: "TUTAGORA helped me improve my math scores by 40%. The tutors are amazing!",
      rating: 5
    },
    {
      name: "Dr. James Okafor",
      role: "Physics Tutor",
      content: "Teaching on TUTAGORA has been incredibly rewarding. The platform is intuitive.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Parent",
      content: "My daughter loves the interactive lessons. Great value for money!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <BookOpen className="h-10 w-10 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">TUTAGORA</span>
                <p className="text-xs text-gray-600">Leading EdTech Africa</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/browse-tutors" className="text-gray-700 hover:text-blue-600 transition-colors">Find Tutors</Link>
              <Link to="/course-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Courses</Link>
              <Link to="/ai-learning" className="text-gray-700 hover:text-blue-600 transition-colors">AI Learning</Link>
              <Link to="/certification" className="text-gray-700 hover:text-blue-600 transition-colors">Certification</Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link to="/browse-tutors">
                <Button variant="outline" size="sm">Find Tutors</Button>
              </Link>
              <Link to="/student-dashboard">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-orange-500/5"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                  <Star className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-700">#1 EdTech Platform in Africa</span>
                </div>
                <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    Learning Journey
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with expert tutors, access AI-powered learning, and achieve your academic goals 
                  with Africa's most advanced educational platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/student-dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/live-tutoring/demo-session">
                  <Button size="lg" variant="outline" className="border-2 border-blue-200 hover:bg-blue-50 px-8 py-3 text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">1,000+</div>
                  <div className="text-sm text-gray-600">Expert Tutors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">20+</div>
                  <div className="text-sm text-gray-600">African Countries</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Image Section */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                  alt="Students collaborating with technology" 
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 animate-bounce">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Live Session Active</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Journey Today</h2>
            <p className="text-xl text-gray-600">Choose your path to educational excellence</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/browse-tutors" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Find Tutors</h3>
                  <p className="text-gray-600 text-sm">Browse expert tutors and book sessions</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/ai-learning" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">AI Learning</h3>
                  <p className="text-gray-600 text-sm">Gamified learning with AI personalization</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/course-dashboard" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Courses</h3>
                  <p className="text-gray-600 text-sm">Structured learning paths and materials</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/certification" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Certification</h3>
                  <p className="text-gray-600 text-sm">Earn recognized certificates and badges</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TUTAGORA?</h2>
            <p className="text-xl text-gray-600">Experience the future of education with cutting-edge features</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied learners and educators</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Future?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of students and educators who are already succeeding with TUTAGORA</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student-dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/tutor-dashboard">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">TUTAGORA</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering African education through innovative technology and expert instruction.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">For Students</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/browse-tutors" className="hover:text-white transition-colors">Find Tutors</Link></li>
                <li><Link to="/course-dashboard" className="hover:text-white transition-colors">Browse Courses</Link></li>
                <li><Link to="/ai-learning" className="hover:text-white transition-colors">AI Learning</Link></li>
                <li><Link to="/certification" className="hover:text-white transition-colors">Certification</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">For Tutors</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/tutor-dashboard" className="hover:text-white transition-colors">Tutor Dashboard</Link></li>
                <li><Link to="/course-creation" className="hover:text-white transition-colors">Create Courses</Link></li>
                <li><Link to="/tutor-availability" className="hover:text-white transition-colors">Set Availability</Link></li>
                <li><Link to="/tutor-analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">M-PESA Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technical Help</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TUTAGORA. All rights reserved. Empowering Africa's educational future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
