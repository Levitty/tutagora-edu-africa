
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Users, Video, Award, Settings, Plus, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const TutorDashboard = () => {
  const upcomingSessions = [
    { id: 1, student: "John Kamau", subject: "Mathematics", time: "2:00 PM", type: "1-on-1", sessionId: "math-101" },
    { id: 2, student: "Sarah Oduya", subject: "Physics", time: "4:00 PM", type: "Group", sessionId: "physics-201" },
    { id: 3, student: "Ahmed Hassan", subject: "Chemistry", time: "6:00 PM", type: "1-on-1", sessionId: "chem-301" }
  ];

  const courses = [
    { id: 1, title: "KCSE Mathematics", students: 45, rating: 4.8, earnings: 15000, totalLessons: 24 },
    { id: 2, title: "Physics Fundamentals", students: 32, rating: 4.9, earnings: 12000, totalLessons: 18 },
    { id: 3, title: "Advanced Chemistry", students: 28, rating: 4.7, earnings: 10500, totalLessons: 20 }
  ];

  const recentStudents = [
    { name: "John Kamau", subject: "Mathematics", progress: 85, lastSeen: "2 hours ago" },
    { name: "Sarah Oduya", subject: "Physics", progress: 72, lastSeen: "1 day ago" },
    { name: "Ahmed Hassan", subject: "Chemistry", progress: 91, lastSeen: "3 hours ago" }
  ];

  const availabilitySlots = [
    { day: "Monday", time: "9:00 AM - 12:00 PM", available: true },
    { day: "Monday", time: "2:00 PM - 5:00 PM", available: false },
    { day: "Tuesday", time: "10:00 AM - 1:00 PM", available: true },
    { day: "Wednesday", time: "3:00 PM - 6:00 PM", available: true }
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. Amina!</h1>
                <p className="text-gray-600">Ready to inspire minds today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">5 sessions today</Badge>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">105</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">KSh 37,500</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">4.8⭐</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Hours Taught</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">124</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Today's Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{session.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{session.student}</h3>
                        <p className="text-gray-600 text-sm">{session.subject} • {session.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{session.time}</p>
                      <Badge variant="outline">{session.type}</Badge>
                    </div>
                    <Link to={`/live-tutoring/${session.sessionId}`}>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students} students
                        </span>
                        <span>{course.rating}⭐</span>
                        <span>{course.totalLessons} lessons</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">KSh {course.earnings.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  My Availability
                </CardTitle>
                <CardDescription>
                  Manage your teaching schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availabilitySlots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{slot.day}</p>
                      <p className="text-sm text-gray-600">{slot.time}</p>
                    </div>
                    <Badge variant={slot.available ? "default" : "secondary"}>
                      {slot.available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Availability
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-gray-600">{student.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">{student.progress}%</Badge>
                      <p className="text-xs text-gray-600">{student.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/course-dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create New Course
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>November Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions Completed</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Students</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">KSh 37,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">4.8⭐</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
