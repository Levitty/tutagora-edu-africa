import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen, Users, Clock, Video, Star, TrendingUp, Award, Search, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { data: bookings = [], isLoading } = useBookings();

  // Filter bookings for this student that are paid and upcoming
  const studentBookings = bookings.filter(booking => 
    booking.student_id === user?.id && 
    booking.payment_status === 'paid' &&
    new Date(booking.scheduled_at) > new Date()
  );

  const handleJoinClass = async (booking: any) => {
    try {
      // Check if there's a live session for this booking
      const { data: liveSession, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('tutor_id', booking.tutor_id)
        .eq('status', 'live')
        .gte('scheduled_at', new Date(booking.scheduled_at).toISOString())
        .lte('scheduled_at', new Date(new Date(booking.scheduled_at).getTime() + booking.duration_minutes * 60000).toISOString())
        .single();

      if (error || !liveSession) {
        toast({
          title: "Class Not Started",
          description: "The tutor hasn't started the class yet. Please wait for them to begin.",
          variant: "destructive",
        });
        return;
      }

      // Join the live session
      window.open(`/live-tutoring/${liveSession.id}`, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to join class",
        variant: "destructive",
      });
    }
  };

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
                {isLoading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : studentBookings.length === 0 ? (
                  <p className="text-gray-500">No upcoming sessions scheduled.</p>
                ) : (
                  studentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage 
                            src={booking.tutor?.profile_photo_url} 
                            alt={booking.tutor?.first_name} 
                          />
                          <AvatarFallback>
                            {booking.tutor?.first_name?.[0]}{booking.tutor?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {booking.tutor?.first_name} {booking.tutor?.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">{booking.subject}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(booking.scheduled_at).toLocaleDateString()} at {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Paid</Badge>
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinClass(booking)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join Class
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toast({ title: "Chat Feature", description: "Chat feature coming soon!" })}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
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
                <div className="text-center">
                  <p>Calendar placeholder - Coming soon!</p>
                </div>
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
