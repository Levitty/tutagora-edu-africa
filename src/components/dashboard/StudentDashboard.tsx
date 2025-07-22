import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen, Users, Clock, Video, Star, TrendingUp, Award, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data for the dashboard
  const upcomingSessions = [
    {
      id: 1,
      tutor: "Dr. Sarah Johnson",
      subject: "Mathematics",
      time: "2:00 PM - 3:00 PM",
      date: "Today",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      tutor: "Prof. Michael Chen",
      subject: "Physics",
      time: "4:00 PM - 5:00 PM",
      date: "Tomorrow",
      avatar: "/api/placeholder/40/40"
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: "Advanced Calculus",
      progress: 75,
      instructor: "Dr. Sarah Johnson",
      nextLesson: "Integration Techniques"
    },
    {
      id: 2,
      title: "Quantum Physics",
      progress: 45,
      instructor: "Prof. Michael Chen",
      nextLesson: "Wave Functions"
    }
  ];

  const studyStats = {
    weeklyHours: 12,
    completedSessions: 8,
    averageGrade: 85,
    streak: 5
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.email?.split('@')[0]}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/browse-tutors">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Tutors
                </Button>
              </Link>
              <Link to="/ai-study-assistant">
                <Button variant="outline" size="sm">AI Assistant</Button>
              </Link>
              <Button onClick={() => signOut()} variant="outline" size="sm">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/browse-tutors">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Find a Tutor</h3>
                <p className="text-sm text-gray-600">Browse expert tutors</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/live-tutoring/demo-session">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">Try Demo Session</h3>
                <p className="text-sm text-gray-600">Experience live tutoring</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/ai-learning">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">AI Learning</h3>
                <p className="text-sm text-gray-600">Interactive AI lessons</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/my-bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold">My Bookings</h3>
                <p className="text-sm text-gray-600">View scheduled sessions</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled tutoring sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.length === 0 ? (
                  <p className="text-gray-500">No upcoming sessions scheduled.</p>
                ) : (
                  upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={session.avatar} alt={session.tutor} />
                          <AvatarFallback>{session.tutor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{session.tutor}</h3>
                          <p className="text-sm text-gray-500">{session.subject}</p>
                        </div>
                      </div>
                      <div>
                        <Badge variant="secondary">{session.date}</Badge>
                        <span className="ml-2 text-sm text-gray-500">{session.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendar and Study Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Calendar</CardTitle>
                <CardDescription>Plan your study schedule</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Stats</CardTitle>
                <CardDescription>Your weekly learning progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Weekly Hours</span>
                  <span className="font-semibold">{studyStats.weeklyHours} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Sessions</span>
                  <span className="font-semibold">{studyStats.completedSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Grade</span>
                  <span className="font-semibold">{studyStats.averageGrade}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Current Streak</span>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="font-semibold">{studyStats.streak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your enrolled courses and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <span className="text-sm text-gray-500">Progress: {course.progress}%</span>
                </div>
                <Progress value={course.progress} />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Instructor: {course.instructor}</span>
                  <span>Next Lesson: {course.nextLesson}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
