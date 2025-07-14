import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Users, Video, Award, Settings, Plus, Clock, Upload, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useTutorCourses } from "@/hooks/useCourses";
import { useProfile } from "@/hooks/useProfile";
import KYCUpload from "@/components/tutor/KYCUpload";
import CourseCreator from "@/components/tutor/CourseCreator";

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'kyc'>('overview');
  const { data: courses = [] } = useTutorCourses();
  const { data: profile } = useProfile();

  // Mock data with channel names for Agora integration
  const upcomingSessions = [
    { 
      id: 1, 
      student: "John Kamau", 
      subject: "Mathematics", 
      time: "2:00 PM", 
      type: "1-on-1", 
      sessionId: "math-101",
      channelName: "john-mathematics-2025-01-08",
      confirmed: true
    },
    { 
      id: 2, 
      student: "Sarah Oduya", 
      subject: "Physics", 
      time: "4:00 PM", 
      type: "Group", 
      sessionId: "physics-201",
      channelName: "sarah-physics-2025-01-08",
      confirmed: true
    },
    { 
      id: 3, 
      student: "Ahmed Hassan", 
      subject: "Chemistry", 
      time: "6:00 PM", 
      type: "1-on-1", 
      sessionId: "chem-301",
      channelName: "ahmed-chemistry-2025-01-08",
      confirmed: false
    }
  ];

  const recentStudents = [
    { name: "John Kamau", subject: "Mathematics", progress: 85, lastSeen: "2 hours ago" },
    { name: "Sarah Oduya", subject: "Physics", progress: 72, lastSeen: "1 day ago" },
    { name: "Ahmed Hassan", subject: "Chemistry", progress: 91, lastSeen: "3 hours ago" }
  ];

  const kycStatus = profile?.kyc_status || 'pending';
  const isKycApproved = kycStatus === 'approved';

  const handleStartLiveClass = (channelName: string) => {
    const liveClassUrl = `https://b180bd1b72aca12734ad-levittys-projects.vercel.app/create?channel=${channelName}`;
    window.open(liveClassUrl, '_blank', 'noopener,noreferrer');
  };

  const generateChannelName = (studentName: string, subject: string) => {
    const firstName = studentName.split(' ')[0].toLowerCase();
    const subjectFormatted = subject.toLowerCase().replace(/\s+/g, '');
    const date = new Date().toISOString().split('T')[0];
    return `${firstName}-${subjectFormatted}-${date}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6">
            <CourseCreator />
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No courses created yet. Create your first course above!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-gray-600 text-sm">{course.subject} • {course.level}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={course.is_published ? "default" : "secondary"}>
                              {course.is_published ? "Published" : "Draft"}
                            </Badge>
                            {course.price && (
                              <span className="text-sm text-green-600">KSh {course.price}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {!course.is_published && (
                            <Button size="sm">
                              Publish
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'kyc':
        return <KYCUpload />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* KYC Status Alert */}
              {!isKycApproved && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-800">
                      <FileText className="h-5 w-5 mr-2" />
                      KYC Verification Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 mb-4">
                      Complete your KYC verification to start offering tutoring services.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('kyc')}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  </CardContent>
                </Card>
              )}

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
                          <p className="text-xs text-gray-500">Channel: {session.channelName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{session.time}</p>
                        <Badge variant="outline">{session.type}</Badge>
                        <Badge variant={session.confirmed ? "default" : "secondary"} className="ml-1">
                          {session.confirmed ? "Confirmed" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/live-tutoring/${session.sessionId}`}>
                          <Button size="sm" variant="outline" disabled={!isKycApproved}>
                            <Video className="h-4 w-4 mr-2" />
                            Legacy
                          </Button>
                        </Link>
                        {session.confirmed && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStartLiveClass(session.channelName)}
                            disabled={!isKycApproved}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Start Live
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Course Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      My Courses ({courses.length})
                    </span>
                    <Button onClick={() => setActiveTab('courses')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {courses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No courses created yet</p>
                      <Button onClick={() => setActiveTab('courses')}>
                        Create Your First Course
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.subject}</p>
                          </div>
                          <Badge variant={course.is_published ? "default" : "secondary"}>
                            {course.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      ))}
                      {courses.length > 3 && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setActiveTab('courses')}
                        >
                          View All Courses
                        </Button>
                      )}
                    </div>
                  )}
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
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('courses')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Courses
                  </Button>
                  <Link to="/tutor-availability">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Set Availability
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('kyc')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    KYC Status
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Students</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Earnings</span>
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
        );
    }
  };

  return (
    <ProtectedRoute requiredRole="tutor">
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
                  Welcome, {profile?.first_name || 'Tutor'}!
                </h1>
                <p className="text-gray-600">Ready to inspire minds today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isKycApproved ? "default" : "secondary"}>
                KYC: {kycStatus}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'kyc', label: 'KYC Verification', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        {activeTab === 'overview' && (
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
                <CardTitle className="text-sm font-medium text-gray-600">Active Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{courses.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">This Month's Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">KSh 37,500</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">4.8⭐</div>
              </CardContent>
            </Card>
          </div>
        )}

        {renderTabContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TutorDashboard;
