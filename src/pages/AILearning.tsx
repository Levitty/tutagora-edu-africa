
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Target, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import AILearningGame from "@/components/ai/AILearningGame";

const AILearning = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = [
    { name: "Mathematics", icon: "📐", color: "bg-blue-100 text-blue-800", description: "Algebra, Geometry, Calculus" },
    { name: "Physics", icon: "⚡", color: "bg-purple-100 text-purple-800", description: "Mechanics, Thermodynamics, Waves" },
    { name: "Chemistry", icon: "🧪", color: "bg-green-100 text-green-800", description: "Organic, Inorganic, Physical" },
    { name: "Biology", icon: "🔬", color: "bg-red-100 text-red-800", description: "Cell Biology, Genetics, Ecology" },
    { name: "English", icon: "📚", color: "bg-yellow-100 text-yellow-800", description: "Grammar, Literature, Writing" },
    { name: "History", icon: "🏛️", color: "bg-indigo-100 text-indigo-800", description: "World History, African History" }
  ];

  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedSubject(null)}
              className="mb-4"
            >
              ← Back to Subjects
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Learning - {selectedSubject}
              </h1>
              <p className="text-gray-600">
                Challenge yourself with AI-powered adaptive learning
              </p>
            </div>
          </div>
          <AILearningGame subject={selectedSubject} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Learning Hub</h1>
                <p className="text-gray-600">Personalized learning powered by AI</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Brain className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Learn Smarter with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience adaptive learning that adjusts to your pace and learning style. 
            Master subjects through interactive games and personalized challenges.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                AI adjusts difficulty based on your performance and learning patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Interactive Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Learn through engaging quizzes and interactive challenges.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and insights.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Selection */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Choose Your Subject
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card 
                key={subject.name}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedSubject(subject.name)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{subject.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-gray-600">{subject.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Learning?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of students who are already learning smarter with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => setSelectedSubject("Mathematics")}
                >
                  Try Demo Game
                </Button>
                <Link to="/browse-tutors">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    Find a Tutor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AILearning;
