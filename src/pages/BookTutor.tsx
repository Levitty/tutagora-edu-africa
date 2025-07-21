import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Book, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking/BookingForm";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Mock tutor data - replace with actual data fetching
const mockTutor = {
  id: "1",
  name: "Dr. Sarah Johnson",
  photo: "https://images.unsplash.com/photo-1494790108755-2616c67e8c89?w=150&h=150&fit=crop&crop=face",
  rating: 4.9,
  reviews: 127,
  hourlyRate: 2500,
  subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
  bio: "Experienced educator with 10+ years in STEM subjects. PhD in Mathematics from University of Nairobi.",
  experience: "10+ years",
  education: "PhD Mathematics, University of Nairobi",
  languages: ["English", "Swahili"],
  responseTime: "Usually responds within 2 hours",
  completedSessions: 1250,
};

export default function BookTutor() {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);

  // In a real app, you'd fetch tutor data based on tutorId
  const tutor = mockTutor;

  if (!tutor) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Tutor Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The tutor you're looking for doesn't exist.
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
                tutorName={tutor.name}
                tutorPhoto={tutor.photo}
                hourlyRate={tutor.hourlyRate}
                subjects={tutor.subjects}
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
                        src={tutor.photo}
                        alt={tutor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">{tutor.name}</h1>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{tutor.rating}</span>
                          </div>
                          <span className="text-muted-foreground">
                            ({tutor.reviews} reviews)
                          </span>
                        </div>
                        <p className="text-muted-foreground">{tutor.bio}</p>
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
                      {tutor.subjects.map(subject => (
                        <Badge key={subject} variant="secondary">
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
                      <p className="text-muted-foreground">{tutor.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Education</h4>
                      <p className="text-muted-foreground">{tutor.education}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Languages</h4>
                      <div className="flex gap-2">
                        {tutor.languages.map(lang => (
                          <Badge key={lang} variant="outline">
                            {lang}
                          </Badge>
                        ))}
                      </div>
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
                        KES {tutor.hourlyRate.toLocaleString()}
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
                      <span className="text-sm">{tutor.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sessions:</span>
                      <span className="font-semibold">{tutor.completedSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-semibold">{tutor.rating}/5</span>
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