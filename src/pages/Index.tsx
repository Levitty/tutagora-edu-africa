
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Video, Award, Globe, Smartphone, Calendar, Download } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TUTAGORA</span>
            </div>
            <div className="space-x-4">
              <Link to="/browse-tutors">
                <Button variant="outline">Browse Tutors</Button>
              </Link>
              <Link to="/student-dashboard">
                <Button>Student Dashboard</Button>
              </Link>
              <Link to="/tutor-dashboard">
                <Button variant="outline">Tutor Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Academic Image */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Leading EdTech in Africa
                <span className="text-blue-600"> 2025-2035</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Empowering African students with live tutoring, offline learning, and AI-driven personalization. 
                From K-12 to university, we're transforming education across the continent.
              </p>
              <div className="space-x-4">
                <Link to="/student-dashboard">
                  <Button size="lg">Start Learning Today</Button>
                </Link>
                <Link to="/tutor-dashboard">
                  <Button size="lg" variant="outline">Become a Tutor</Button>
                </Link>
              </div>
              
              {/* Quick Access Cards */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link to="/browse-tutors">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="font-semibold">Browse Tutors</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/course-dashboard">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                      <p className="font-semibold">View Courses</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
            
            {/* Academic Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000&auto=format&fit=crop"
                alt="Students learning with laptops" 
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Empowering African Education</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TUTAGORA?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Experience TUTAGORA Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/live-tutoring/demo-session">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Try Live Tutoring</h3>
                  <p className="text-sm text-gray-600">Join a demo session</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/browse-tutors">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-semibold mb-2">Book a Tutor</h3>
                  <p className="text-sm text-gray-600">Schedule sessions</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/course-dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Exam Prep</h3>
                  <p className="text-sm text-gray-600">KCSE, JAMB & more</p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Download className="h-8 w-8 mx-auto mb-4 text-orange-500" />
                <h3 className="font-semibold mb-2">Offline Content</h3>
                <p className="text-sm text-gray-600">Download lessons</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Students Enrolled</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Expert Tutors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-blue-200">African Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">TUTAGORA</span>
              </div>
              <p className="text-gray-400">
                Leading EdTech platform transforming education across Africa
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Live Tutoring</li>
                <li>Offline Learning</li>
                <li>Exam Preparation</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Tutors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Create Courses</li>
                <li>Manage Students</li>
                <li>Earn Income</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>M-PESA Support</li>
                <li>Technical Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TUTAGORA. All rights reserved. Empowering African Education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
