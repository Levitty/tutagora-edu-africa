
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, Video, Award, User, Download, Play, Brain, MessageCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import AILearningGame from "@/components/ai/AILearningGame";
import { useCourses } from "@/hooks/useCourses";
import { useProfile } from "@/hooks/useProfile";

const StudentDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const { data: courses = [] } = useCourses();
  const { data: profile } = useProfile();

  // Mock data for demonstration
  const upcomingClasses = [
    { 
      id: 1, 
      subject: "Mathematics", 
      tutor: "Dr. Amina Ochieng", 
      time: "2:00 PM", 
      date: "Today", 
      sessionId: "math-101",
      channelName: "john-mathematics-2025-01-08"
    },
    { 
      id: 2, 
      subject: "Physics", 
      tutor: "Prof. Kwame Asante", 
      time: "4:00 PM", 
      date: "Tomorrow", 
      sessionId: "physics-201",
      channelName: "john-physics-2025-01-09"
    },
    { 
      id: 3, 
      subject: "Chemistry", 
      tutor: "Dr. Fatima Ibrahim", 
      time: "10:00 AM", 
      date: "Wednesday", 
      sessionId: "chem-301",
      channelName: "john-chemistry-2025-01-10"
    }
  ];

  const recentScores = [
    { subject: "Mathematics", score: 85, date: "Nov 20" },
    { subject: "Physics", score: 78, date: "Nov 18" },
    { subject: "Chemistry", score: 92, date: "Nov 15" }
  ];

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];

  const handleJoinLiveClass = (channelName: string) => {
    const liveClassUrl = `https://tutorlive.vercel.app/?channel=${channelName}`;
    window.open(liveClassUrl, '_blank', 'noopener,noreferrer');
  };

  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedSubject(null)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">AI Learning - {selectedSubject}</h1>
          </div>
          <AILearningGame subject={selectedSubject} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {profile?.first_name || 'Student'}!
                </h1>
                <p className="text-gray-600">Ready to continue learning?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">3 classes today</Badge>
              <Link to="/ai-study-assistant">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
              </Link>
              <Link to="/browse-tutors">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Tutor
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Hours Studied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">48</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">85%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">7 days</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Study Assistant Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  AI Study Assistant
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Get instant help with homework, assignments, and study questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Link to="/ai-study-assistant">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Ask AI Questions
                    </Button>
                  </Link>
                  <Link to="/ai-learning">
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <Brain className="h-4 w-4 mr-2" />
                      Play Learning Games
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* AI Learning Games */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Learning Games
                </CardTitle>
                <CardDescription>
                  Practice with AI-powered interactive games
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <Brain className="h-6 w-6 mb-1" />
                      <span className="text-sm">{subject}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{cls.subject}</h3>
                      <p className="text-gray-600 text-sm">{cls.tutor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{cls.time}</p>
                      <p className="text-gray-600 text-sm">{cls.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/live-tutoring/${cls.sessionId}`}>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-2" />
                          Legacy
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        onClick={() => handleJoinLiveClass(cls.channelName)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Join Live
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Available Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Available Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-gray-600 text-sm">{course.subject} • {course.level}</p>
                      <p className="text-green-600 font-medium">
                        {course.price ? `KSh ${course.price}` : 'Free'}
                      </p>
                    </div>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Enroll
                    </Button>
                  </div>
                ))}
                <Link to="/course-dashboard">
                  <Button variant="outline" className="w-full">
                    View All Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recent Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentScores.map((score, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{score.subject}</p>
                      <p className="text-sm text-gray-600">{score.date}</p>
                    </div>
                    <Badge variant={score.score >= 80 ? "default" : "secondary"}>
                      {score.score}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Study Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-blue-600">25:00</div>
                <p className="text-gray-600">Pomodoro Session</p>
                <Button className="w-full">Start Study Session</Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/ai-study-assistant">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    AI Study Help
                  </Button>
                </Link>
                <Link to="/course-dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/browse-tutors">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Find Tutors
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  View Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
