
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Users, Video, Award, Settings, AlertTriangle, CheckCircle, Upload, DollarSign, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { TutorOnboarding } from "@/components/tutor/TutorOnboarding";

export const TutorDashboard = () => {
  const { data: profile } = useProfile();
  const kycStatus = profile?.kyc_status || 'pending';
  const isKycApproved = kycStatus === 'approved';
  const [showKYC, setShowKYC] = useState(false);

  const upcomingSessions = [
    { 
      id: 1, 
      student: "John Kamau", 
      subject: "Mathematics", 
      time: "2:00 PM", 
      type: "1-on-1", 
      earnings: 500,
      status: "confirmed"
    },
    { 
      id: 2, 
      student: "Sarah Oduya", 
      subject: "Physics", 
      time: "4:00 PM", 
      type: "Group", 
      earnings: 300,
      status: "pending"
    },
    { 
      id: 3, 
      student: "Ahmed Hassan", 
      subject: "Chemistry", 
      time: "6:00 PM", 
      type: "1-on-1", 
      earnings: 600,
      status: "confirmed"
    }
  ];

  const monthlyStats = {
    totalEarnings: 45750,
    pendingPayouts: 12500,
    completedSessions: 28,
    newStudents: 12,
    averageRating: 4.8,
    totalStudents: 105,
    activeCourses: 8,
    responseTime: "2.3 min"
  };

  const handleStartKYC = () => {
    setShowKYC(true);
  };

  if (!isKycApproved) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {profile?.first_name || 'Tutor'}!
                  </h1>
                  <p className="text-gray-600">Complete your verification to start tutoring</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`
                  ${kycStatus === 'pending' ? 'bg-orange-100 text-orange-800' : 
                    kycStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}
                `}
              >
                KYC: {kycStatus}
              </Badge>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TutorOnboarding kycStatus={kycStatus} onStartKYC={handleStartKYC} />
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
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {profile?.first_name || 'Tutor'}!
                </h1>
                <p className="text-gray-600">Ready to inspire minds today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Students</p>
                  <p className="text-3xl font-bold">{monthlyStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Monthly Earnings</p>
                  <p className="text-3xl font-bold">KSh {monthlyStats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Active Courses</p>
                  <p className="text-3xl font-bold">{monthlyStats.activeCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Average Rating</p>
                  <p className="text-3xl font-bold">{monthlyStats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Today's Sessions
                  </span>
                  <span className="text-sm text-gray-500">
                    Total: KSh {upcomingSessions.reduce((sum, session) => sum + session.earnings, 0)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                      <p className="text-green-600 text-sm">KSh {session.earnings}</p>
                      <Badge 
                        variant={session.status === 'confirmed' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Video className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{monthlyStats.completedSessions}</p>
                    <p className="text-sm text-gray-600">Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{monthlyStats.newStudents}</p>
                    <p className="text-sm text-gray-600">New Students</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{monthlyStats.averageRating}⭐</p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{monthlyStats.responseTime}</p>
                    <p className="text-sm text-gray-600">Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <Users className="h-4 w-4 mr-2" />
                  View All Students
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Earnings Report
                </Button>
              </CardContent>
            </Card>

            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Earnings Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-green-600">KSh {monthlyStats.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Payout</span>
                  <span className="font-semibold text-orange-500">KSh {monthlyStats.pendingPayouts.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Request Payout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                    <span className="ml-2 text-sm font-medium">John Kamau</span>
                  </div>
                  <p className="text-sm text-gray-600">"Excellent teaching methodology!"</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                    <span className="ml-2 text-sm font-medium">Sarah Oduya</span>
                  </div>
                  <p className="text-sm text-gray-600">"Very patient and knowledgeable."</p>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
