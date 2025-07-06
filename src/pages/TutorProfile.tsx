
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Star, Users, Clock, Video, Calendar as CalendarIcon, BookOpen, ArrowLeft, Play, CheckCircle, Globe, Award, MapPin, Phone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const TutorProfile = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Mock tutor data - in real app, this would be fetched based on tutorId
  const tutor = {
    id: parseInt(tutorId || "1"),
    name: "Dr. Amina Ochieng",
    subjects: ["Mathematics", "Physics"],
    rating: 4.9,
    totalReviews: 156,
    students: 245,
    experience: "8 years",
    price: "KSh 800/hour",
    languages: ["English", "Swahili"],
    university: "University of Nairobi",
    qualification: "PhD in Applied Mathematics",
    location: "Nairobi, Kenya",
    description: "Experienced mathematics and physics tutor specializing in KCSE preparation and university-level concepts. I have helped over 200 students achieve their academic goals with personalized teaching methods.",
    longBio: "With 8 years of tutoring experience and a PhD in Applied Mathematics from the University of Nairobi, I specialize in making complex mathematical and physics concepts accessible to students of all levels. My teaching approach combines theoretical understanding with practical applications, ensuring students not only pass their exams but develop a genuine appreciation for the subjects. I have successfully guided students through KCSE, A-levels, and university coursework, with a 95% pass rate among my students.",
    avatar: "/api/placeholder/200/200",
    introVideoUrl: "/api/placeholder/video.mp4",
    achievements: [
      "PhD in Applied Mathematics - University of Nairobi",
      "8+ years teaching experience",
      "95% student pass rate",
      "KCSE Mathematics examiner for 3 years",
      "Published researcher in mathematical modeling"
    ],
    availability: {
      "2024-12-02": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"],
      "2024-12-03": ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
      "2024-12-04": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "7:00 PM"],
      "2024-12-05": ["8:00 AM", "10:00 AM", "3:00 PM", "5:00 PM"],
      "2024-12-06": ["9:00 AM", "1:00 PM", "4:00 PM", "6:00 PM"]
    },
    reviews: [
      {
        id: 1,
        student: "James M.",
        rating: 5,
        comment: "Dr. Amina helped me improve my mathematics grade from C to A in just 3 months. Her teaching method is exceptional!",
        date: "2 weeks ago"
      },
      {
        id: 2,
        student: "Sarah K.",
        rating: 5,
        comment: "Excellent physics tutor. Made complex concepts easy to understand. Highly recommend!",
        date: "1 month ago"
      },
      {
        id: 3,
        student: "David O.",
        rating: 4,
        comment: "Very patient and knowledgeable. Helped me prepare for my university entrance exams.",
        date: "2 months ago"
      }
    ]
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tutor.availability[dateStr] || [];
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

    setSelectedTime(time);
    toast.success(`Session booked for ${selectedDate.toDateString()} at ${time}`);
    navigate(`/live-tutoring/tutor-${tutor.id}`);
  };

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
                      <AvatarImage src={tutor.avatar} />
                      <AvatarFallback className="text-2xl">
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
                        <p className="text-lg text-gray-600 mb-2">{tutor.qualification}</p>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{tutor.location}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <Star className="h-5 w-5 text-yellow-400 mr-1" />
                          <span className="font-bold text-lg">{tutor.rating}</span>
                          <span className="text-gray-600 ml-1">({tutor.totalReviews} reviews)</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{tutor.price}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tutor.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <div className="font-semibold">{tutor.experience}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Students:</span>
                        <div className="font-semibold">{tutor.students}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Languages:</span>
                        <div className="font-semibold">{tutor.languages.join(", ")}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">University:</span>
                        <div className="font-semibold">{tutor.university}</div>
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
                  Get to know {tutor.name.split(' ')[1]} before booking your first session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">2-minute introduction video</p>
                    <Button className="mt-4">
                      <Play className="h-4 w-4 mr-2" />
                      Play Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {tutor.name.split(' ')[1]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6 leading-relaxed">{tutor.longBio}</p>
                
                <h4 className="font-semibold mb-3">Achievements & Qualifications</h4>
                <ul className="space-y-2">
                  {tutor.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tutor.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.student}</span>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
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
                          variant={selectedTime === time ? "default" : "outline"}
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
                    <span className="text-xl font-bold text-blue-600">{tutor.price}</span>
                  </div>
                  
                  <Button 
                    className="w-full mb-3"
                    onClick={() => handleBookSession("Next Available")}
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
                  <span className="font-semibold">< 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat Students</span>
                  <span className="font-semibold">85%</span>
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
