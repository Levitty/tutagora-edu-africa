
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Book, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking/BookingForm";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function BookTutor() {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Fetch tutor data from database
  const { data: tutor, isLoading, error } = useQuery({
    queryKey: ['tutor-booking', tutorId],
    queryFn: async () => {
      if (!tutorId) throw new Error('No tutor ID provided');
      
      console.log('Fetching tutor for booking with ID:', tutorId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', tutorId)
        .eq('role', 'tutor')
        .single();
      
      if (error) {
        console.error('Error fetching tutor for booking:', error);
        throw error;
      }
      
      console.log('Fetched tutor data for booking:', data);
      return data;
    },
    enabled: !!tutorId,
  });

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tutor information...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !tutor) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Tutor Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The tutor you're looking for doesn't exist or is not available for booking.
              </p>
              <Button onClick={() => navigate('/browse-tutors')}>
                Browse Tutors
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const tutorName = `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() || 'Anonymous Tutor';
  const subjects = tutor.expertise || tutor.preferred_subjects || ['Mathematics'];
  const hourlyRate = tutor.hourly_rate || 2500;

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/browse-tutors')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tutors
            </Button>
          </div>

          {showBookingForm ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Book a Session</h1>
                <Button 
                  variant="outline" 
                  onClick={() => setShowBookingForm(false)}
                >
                  View Profile
                </Button>
              </div>
              
              <BookingForm
                tutorId={tutor.id}
                tutorName={tutorName}
                tutorPhoto={tutor.profile_photo_url}
                hourlyRate={hourlyRate}
                subjects={subjects}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={tutor.profile_photo_url || '/api/placeholder/80/80'}
                        alt={tutorName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">{tutorName}</h1>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.8</span>
                          </div>
                          <span className="text-muted-foreground">
                            (25+ reviews)
                          </span>
                          <Badge variant={tutor.kyc_status === 'approved' ? 'default' : 'secondary'}>
                            {tutor.kyc_status === 'approved' ? 'Verified' : 'Tutor'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {tutor.bio || `Experienced educator specializing in ${subjects.join(', ')}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subjects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Subjects Taught
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience & Education */}
                <Card>
                  <CardHeader>
                    <CardTitle>Experience & Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Experience</h4>
                      <p className="text-muted-foreground">{tutor.teaching_experience || '5+ years of teaching experience'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Education</h4>
                      <p className="text-muted-foreground">{tutor.education_background || 'Qualified educator'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Location</h4>
                      <Badge variant="outline">
                        {tutor.country || 'Kenya'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Sidebar */}
              <div className="space-y-6">
                {/* Pricing Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        KES {hourlyRate.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">per hour</div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book a Session
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="text-sm">Usually within 2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sessions:</span>
                      <span className="font-semibold">200+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-semibold">4.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-semibold text-green-600">Available</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
