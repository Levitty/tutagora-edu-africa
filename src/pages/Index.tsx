
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Video, Award, Globe, Smartphone } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignUpModal } from "@/components/auth/SignUpModal";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

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
              <Button variant="outline" onClick={() => setShowLogin(true)}>
                Login
              </Button>
              <Button onClick={() => setShowSignUp(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Leading EdTech in Africa
            <span className="text-blue-600"> 2025-2035</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering African students with live tutoring, offline learning, and AI-driven personalization. 
            From K-12 to university, we're transforming education across the continent.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => setShowSignUp(true)}>
              Start Learning Today
            </Button>
            <Button size="lg" variant="outline">
              Become a Tutor
            </Button>
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Education?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of African students already learning with TUTAGORA
          </p>
          <Button size="lg" onClick={() => setShowSignUp(true)}>
            Start Your Journey Today
          </Button>
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

      {/* Modals */}
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      <SignUpModal open={showSignUp} onOpenChange={setShowSignUp} />
    </div>
  );
};

export default Index;
