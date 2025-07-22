
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Users, Clock, Video, Search, BookOpen, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TutorBrowsing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Fetch tutors from database
  const { data: tutors = [], isLoading, error } = useQuery({
    queryKey: ['tutors'],
    queryFn: async () => {
      console.log('Fetching tutors from database...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'tutor');
      
      if (error) {
        console.error('Error fetching tutors:', error);
        throw error;
      }
      
      console.log('Fetched tutors:', data);
      return data || [];
    },
  });

  // Filter tutors based on search criteria
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = !searchTerm || 
      `${tutor.first_name || ''} ${tutor.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tutor.expertise && tutor.expertise.some((subject: string) => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (tutor.preferred_subjects && tutor.preferred_subjects.some((subject: string) => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesSubject = selectedSubject === "all" || 
      (tutor.expertise && tutor.expertise.includes(selectedSubject)) ||
      (tutor.preferred_subjects && tutor.preferred_subjects.includes(selectedSubject));
    
    return matchesSearch && matchesSubject;
  });

  const handleBookTutor = (tutorId: string) => {
    if (!user) {
      toast.error("Please sign in to book a tutor");
      navigate("/auth");
      return;
    }
    
    console.log('Navigating to book tutor with ID:', tutorId);
    navigate(`/book-tutor/${tutorId}`);
  };

  const handleViewProfile = (tutorId: string) => {
    console.log('Navigating to tutor profile with ID:', tutorId);
    navigate(`/tutor-profile/${tutorId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Tutors</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the tutors. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link to="/">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Find Your Perfect Tutor</h1>
                </div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tutors or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Geography">Geography</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="primary">Primary School</SelectItem>
                <SelectItem value="secondary">Secondary School</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} matching your criteria
          </p>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => {
            const tutorName = `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() || 'Anonymous Tutor';
            const subjects = tutor.expertise || tutor.preferred_subjects || ['General'];
            const hourlyRate = tutor.hourly_rate || 2500;

            return (
              <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={tutor.profile_photo_url} />
                      <AvatarFallback>
                        {tutor.first_name?.[0]}{tutor.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tutorName}</CardTitle>
                      <CardDescription>
                        {tutor.education_background || 'Experienced Educator'}
                      </CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-sm text-gray-500">(25+ reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-1">
                      {subjects.slice(0, 3).map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {subjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>100+ students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Available today</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        KES {hourlyRate.toLocaleString()}
                      </span>
                      <span className="text-gray-500">/hour</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(tutor.id)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleBookTutor(tutor.id)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or browse all available tutors.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubject("all");
                  setSelectedLevel("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorBrowsing;
