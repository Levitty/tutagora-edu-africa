import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Star, Users, Clock, Video, Calendar as CalendarIcon, BookOpen, ArrowLeft, Play, CheckCircle, Globe, Award, MapPin, Phone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TutorProfile = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch tutor data from database
  const { data: tutor, isLoading, error } = useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: async () => {
      if (!tutorId) throw new Error('No tutor ID provided');
      
      console.log('Fetching tutor with ID:', tutorId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', tutorId)
        .eq('role', 'tutor')
        .single();
      
      if (error) {
        console.error('Error fetching tutor:', error);
        throw error;
      }
      
      console.log('Fetched tutor data:', data);
      return data;
    },
    enabled: !!tutorId,
  });

  // Mock availability data - in real app, this would be fetched from database
  const mockAvailability = {
    "2024-12-02": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"],
    "2024-12-03": ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
    "2024-12-04": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "7:00 PM"],
    "2024-12-05": ["8:00 AM", "10:00 AM", "3:00 PM", "5:00 PM"],
    "2024-12-06": ["9:00 AM", "1:00 PM", "4:00 PM", "6:00 PM"]
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockAvailability[dateStr] || [];
  };

  const handleBookSession = (time: string) => {
    if (!user) {
      toast.error("Please sign in to book a session");
      navigate("/auth");
      return;
    }
    
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    // Navigate to the booking page with the correct tutor ID
    console.log('Navigating to book tutor with ID:', tutorId);
    navigate(`/book-tutor/${tutorId}`);
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please sign in to book a session");
      navigate("/auth");
      return;
    }
    
    console.log('Navigating to book tutor with ID:', tutorId);
    navigate(`/book-tutor/${tutorId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Tutor Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The tutor you're looking for doesn't exist or is not available.
            </p>
            <Button onClick={() => navigate('/browse-tutors')}>
              Browse Tutors
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tutorName = `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() || 'Anonymous Tutor';
  const subjects = tutor.expertise || tutor.preferred_subjects || ['Mathematics'];
  const hourlyRate = tutor.hourly_rate || 2500;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/browse-tutors")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tutors
            </Button>
            <Link to="/">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </Link>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Tutor Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={tutor.profile_photo_url} />
                      <AvatarFallback className="text-2xl">
                        {tutor.first_name?.[0]}{tutor.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutorName}</h1>
                        <p className="text-lg text-gray-600 mb-2">{tutor.education_background || 'Experienced Educator'}</p>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{tutor.country || 'Kenya'}</span>
                        </div>
                        <Badge variant={tutor.kyc_status === 'approved' ? 'default' : 'secondary'}>
                          {tutor.kyc_status === 'approved' ? 'Verified Tutor' : 'Tutor'}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <Star className="h-5 w-5 text-yellow-400 mr-1" />
                          <span className="font-bold text-lg">4.8</span>
                          <span className="text-gray-600 ml-1">(25+ reviews)</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          KES {hourlyRate.toLocaleString()}/hour
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <div className="font-semibold">{tutor.teaching_experience || '5+ years'}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Students:</span>
                        <div className="font-semibold">100+</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Country:</span>
                        <div className="font-semibold">{tutor.country || 'Kenya'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Introduction Video */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Introduction Video
                </CardTitle>
                <CardDescription>
                  Get to know {tutor.first_name || 'this tutor'} before booking your first session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Introduction video coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {tutor.first_name || 'This Tutor'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {tutor.bio || `${tutorName} is an experienced educator dedicated to helping students achieve their academic goals. With expertise in ${subjects.join(', ')}, they provide personalized tutoring sessions tailored to each student's learning style and needs.`}
                </p>
                
                {tutor.education_background && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Education</h4>
                    <p className="text-gray-700">{tutor.education_background}</p>
                  </div>
                )}

                {tutor.teaching_experience && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Teaching Experience</h4>
                    <p className="text-gray-700">{tutor.teaching_experience}</p>
                  </div>
                )}

                {tutor.certifications && tutor.certifications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3">Certifications</h4>
                    <ul className="space-y-2">
                      {tutor.certifications.map((cert, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">John M.</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 weeks ago</span>
                    </div>
                    <p className="text-gray-700">Excellent tutor! Really helped me understand complex mathematical concepts.</p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Sarah K.</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">1 month ago</span>
                    </div>
                    <p className="text-gray-700">Very patient and explains everything clearly. Highly recommend!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Book a Session
                </CardTitle>
                <CardDescription>
                  Select a date and time that works for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <h4 className="font-medium mb-3">
                      Available times for {selectedDate.toDateString()}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailabilityForDate(selectedDate).map((time, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookSession(time)}
                          className="text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    {getAvailabilityForDate(selectedDate).length === 0 && (
                      <p className="text-gray-600 text-sm">No available slots for this date</p>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Session Rate:</span>
                    <span className="text-xl font-bold text-blue-600">
                      KES {hourlyRate.toLocaleString()}/hour
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full mb-3"
                    onClick={handleBookNow}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Book Session Now
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/live-tutoring/demo-session`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo First
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">&lt; 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-semibold">200+</span>
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

export default TutorProfile;
