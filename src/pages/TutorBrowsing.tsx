
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, Star, Users, Clock, Video, Calendar as CalendarIcon, BookOpen, Play, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TutorBrowsing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch verified tutors from database
  const { data: tutors = [], isLoading, refetch } = useQuery({
    queryKey: ['verified-tutors'],
    queryFn: async () => {
      console.log('Fetching verified tutors...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'tutor')
        .eq('kyc_status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tutors:', error);
        throw error;
      }
      console.log('Fetched tutors:', data);
      return data || [];
    }
  });

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const subjects = [
    { id: "all", name: "All Subjects" },
    { id: "mathematics", name: "Mathematics" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "english", name: "English" },
    { id: "biology", name: "Biology" },
    { id: "programming", name: "Programming" }
  ];

  // Filter tutors based on search and subject
  const filteredTutors = tutors.filter(tutor => {
    const fullName = `${tutor.first_name} ${tutor.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         (tutor.expertise || []).some((subject: string) => 
                           subject.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesSubject = selectedSubject === "all" || 
                          (tutor.expertise || []).some((subject: string) => 
                            subject.toLowerCase().includes(selectedSubject.toLowerCase())
                          );
    return matchesSearch && matchesSubject;
  });

  const handleBookSession = (tutorId: string) => {
    if (!user) {
      toast.error("Please sign in to book a session");
      navigate("/auth");
      return;
    }
    navigate(`/book-tutor?tutor=${tutorId}`);
  };

  const handleViewProfile = (tutorId: string) => {
    navigate(`/tutor-profile/${tutorId}`);
  };

  const handleViewCalendar = (tutorId: string) => {
    setSelectedTutor(selectedTutor === tutorId ? null : tutorId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verified tutors...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Browse Tutors</h1>
                <p className="text-gray-600">Find and book expert tutors for live sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">Back to Home</Button>
              </Link>
              {user ? (
                <Link to="/student-dashboard">
                  <Button variant="outline" size="sm">My Dashboard</Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
              <Link to="/live-tutoring/demo-session">
                <Button size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Try Demo Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tutors by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={selectedSubject === subject.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject.id)}
              >
                {subject.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tutors List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredTutors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No tutors found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or browse all subjects</p>
                </div>
              ) : (
                filteredTutors.map((tutor) => (
                  <Card key={tutor.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Tutor Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div 
                              className="cursor-pointer"
                              onClick={() => handleViewProfile(tutor.id)}
                            >
                              <Avatar className="h-20 w-20 hover:ring-2 hover:ring-blue-500 transition-all">
                                <AvatarImage src={tutor.profile_photo_url} />
                                <AvatarFallback>
                                  {tutor.first_name?.[0]}{tutor.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h3 
                                    className="text-xl font-bold hover:text-blue-600 cursor-pointer transition-colors"
                                    onClick={() => handleViewProfile(tutor.id)}
                                  >
                                    {tutor.first_name} {tutor.last_name}
                                  </h3>
                                  <Badge variant="secondary" className="mt-1">
                                    Verified Tutor
                                  </Badge>
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="font-medium">4.8</span>
                                  <span className="text-gray-600 ml-1">(25+ reviews)</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex flex-wrap gap-2">
                                  {(tutor.expertise || []).map((subject, index) => (
                                    <Badge key={index} variant="secondary">{subject}</Badge>
                                  ))}
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>{tutor.teaching_experience || "Experienced tutor"}</span>
                                  {tutor.education_background && (
                                    <>
                                      <span>•</span>
                                      <span>{tutor.education_background}</span>
                                    </>
                                  )}
                                  {tutor.hourly_rate && (
                                    <>
                                      <span>•</span>
                                      <span className="font-semibold text-blue-600">KSh {tutor.hourly_rate}/hour</span>
                                    </>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Country:</span>
                                  <Badge variant="outline" className="text-xs">
                                    {tutor.country || "Kenya"}
                                  </Badge>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-4">{tutor.bio || "Experienced tutor ready to help you achieve your academic goals."}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-green-600">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Available for booking
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewProfile(tutor.id)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Profile
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleBookSession(tutor.id)}
                                  >
                                    <Video className="h-4 w-4 mr-2" />
                                    Book Session
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Tutor Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Tutors</span>
                  <span className="font-semibold">{filteredTutors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">4.7⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-semibold">1,200+</span>
                </div>
              </CardContent>
            </Card>

            {/* Popular Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Subjects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Mathematics", "Physics", "Chemistry", "English", "Biology"].map((subject) => (
                  <Button
                    key={subject}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedSubject(subject.toLowerCase())}
                  >
                    {subject}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Not sure which tutor to choose? Try our demo session first!
                </p>
                <Link to="/live-tutoring/demo-session">
                  <Button className="w-full" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Try Demo Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorBrowsing;
