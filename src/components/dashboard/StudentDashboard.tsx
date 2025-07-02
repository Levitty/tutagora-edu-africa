
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, Video, Award, User } from "lucide-react";

export const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const upcomingClasses = [
    { id: 1, subject: "Mathematics", tutor: "Dr. Amina Ochieng", time: "2:00 PM", date: "Today" },
    { id: 2, subject: "Physics", tutor: "Prof. Kwame Asante", time: "4:00 PM", date: "Tomorrow" },
    { id: 3, subject: "Chemistry", tutor: "Dr. Fatima Ibrahim", time: "10:00 AM", date: "Wednesday" }
  ];

  const courses = [
    { id: 1, title: "KCSE Mathematics Prep", progress: 75, lessons: 24, completed: 18 },
    { id: 2, title: "Physics for JAMB", progress: 45, lessons: 32, completed: 14 },
    { id: 3, title: "Web Development", progress: 90, lessons: 20, completed: 18 }
  ];

  const recentScores = [
    { subject: "Mathematics", score: 85, date: "Nov 20" },
    { subject: "Physics", score: 78, date: "Nov 18" },
    { subject: "Chemistry", score: 92, date: "Nov 15" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
                <p className="text-gray-600">Ready to continue learning?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">3 classes today</Badge>
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">12</div>
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
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{course.title}</h3>
                      <span className="text-sm text-gray-600">
                        {course.completed}/{course.lessons} lessons
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{course.progress}% complete</span>
                      <Button variant="outline" size="sm">Continue</Button>
                    </div>
                  </div>
                ))}
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
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Class
                </Button>
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
