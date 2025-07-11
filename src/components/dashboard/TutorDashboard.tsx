
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Users, Video, Award, Settings, AlertTriangle, CheckCircle, Upload, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

export const TutorDashboard = () => {
  const { data: profile } = useProfile();
  const kycStatus = profile?.kyc_status || 'pending';
  const isKycApproved = kycStatus === 'approved';

  const upcomingSessions = [
    { id: 1, student: "John Kamau", subject: "Mathematics", time: "2:00 PM", type: "1-on-1", earnings: 500 },
    { id: 2, student: "Sarah Oduya", subject: "Physics", time: "4:00 PM", type: "Group", earnings: 300 },
    { id: 3, student: "Ahmed Hassan", subject: "Chemistry", time: "6:00 PM", type: "1-on-1", earnings: 600 }
  ];

  const monthlyStats = {
    totalEarnings: 45750,
    pendingPayouts: 12500,
    completedSessions: 28,
    newStudents: 12,
    averageRating: 4.8
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
              <Badge variant="secondary">KYC: {kycStatus}</Badge>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KYC Required Card */}
          <Card className="border-orange-200 bg-orange-50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="h-6 w-6 mr-2" />
                KYC Verification Required
              </CardTitle>
              <CardDescription className="text-orange-700">
                To start offering tutoring services and receive payments, you need to complete your Know Your Customer (KYC) verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-800">Required Documents:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• National ID or Passport</li>
                      <li>• Teaching Certificate/Degree</li>
                      <li>• Professional Photo</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-800">Benefits After Verification:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Start accepting students</li>
                      <li>• Receive payments</li>
                      <li>• Create courses</li>
                      <li>• Schedule live sessions</li>
                    </ul>
                  </div>
                </div>
                <Link to="/tutor-dashboard">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Start KYC Verification
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Preview Cards (Disabled) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-4">
                  Complete KYC to start scheduling sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-4">
                  Complete KYC to start earning
                </p>
              </CardContent>
            </Card>
          </div>
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
                  Welcome, {profile?.first_name || 'Tutor'}!
                </h1>
                <p className="text-gray-600">Ready to inspire minds today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                KYC Verified
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
        {/* Earnings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">KSh {monthlyStats.totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">KSh {monthlyStats.pendingPayouts.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{monthlyStats.completedSessions}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{monthlyStats.newStudents}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{monthlyStats.averageRating}⭐</div>
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
                      <p className="text-green-600 text-sm">KSh {session.earnings}</p>
                      <Badge variant="outline">{session.type}</Badge>
                    </div>
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="text-xs">Create Course</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-xs">Schedule Session</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-xs">View Students</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span className="text-xs">Payouts</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-semibold">84h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">96%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">2.3 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Completion</span>
                  <span className="font-semibold">89%</span>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
