
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, Star, Users, Clock, Video, Calendar as CalendarIcon, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const TutorBrowsing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTutor, setSelectedTutor] = useState<number | null>(null);

  const subjects = [
    { id: "all", name: "All Subjects" },
    { id: "mathematics", name: "Mathematics" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "english", name: "English" },
    { id: "biology", name: "Biology" },
    { id: "programming", name: "Programming" }
  ];

  const tutors = [
    {
      id: 1,
      name: "Dr. Amina Ochieng",
      subjects: ["Mathematics", "Physics"],
      rating: 4.9,
      students: 245,
      experience: "8 years",
      price: "KSh 800/hour",
      languages: ["English", "Swahili"],
      university: "University of Nairobi",
      description: "Experienced mathematics and physics tutor specializing in KCSE preparation.",
      avatar: "/api/placeholder/150/150",
      availability: {
        "2024-12-02": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
        "2024-12-03": ["10:00 AM", "1:00 PM", "3:00 PM"],
        "2024-12-04": ["9:00 AM", "2:00 PM", "5:00 PM"]
      },
      nextAvailable: "Today at 2:00 PM"
    },
    {
      id: 2,
      name: "Prof. Kwame Asante",
      subjects: ["Physics", "Chemistry"],
      rating: 4.8,
      students: 189,
      experience: "12 years",
      price: "KSh 1000/hour",
      languages: ["English", "Twi"],
      university: "University of Ghana",
      description: "Physics professor with expertise in university-level concepts and JAMB preparation.",
      avatar: "/api/placeholder/150/150",
      availability: {
        "2024-12-02": ["8:00 AM", "10:00 AM", "3:00 PM"],
        "2024-12-03": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
        "2024-12-04": ["10:00 AM", "1:00 PM"]
      },
      nextAvailable: "Tomorrow at 9:00 AM"
    },
    {
      id: 3,
      name: "Dr. Fatima Ibrahim",
      subjects: ["Chemistry", "Biology"],
      rating: 4.7,
      students: 156,
      experience: "6 years",
      price: "KSh 750/hour",
      languages: ["English", "Arabic", "Hausa"],
      university: "Ahmadu Bello University",
      description: "Chemistry and biology expert with focus on medical school preparation.",
      avatar: "/api/placeholder/150/150",
      availability: {
        "2024-12-02": ["11:00 AM", "1:00 PM", "4:00 PM"],
        "2024-12-03": ["9:00 AM", "3:00 PM", "5:00 PM"],
        "2024-12-04": ["8:00 AM", "12:00 PM", "2:00 PM"]
      },
      nextAvailable: "Today at 4:00 PM"
    },
    {
      id: 4,
      name: "Ms. Grace Wanjiku",
      subjects: ["English", "Literature"],
      rating: 4.6,
      students: 134,
      experience: "5 years",
      price: "KSh 600/hour",
      languages: ["English", "Swahili", "Kikuyu"],
      university: "Kenyatta University",
      description: "English literature specialist with expertise in KCSE set books and creative writing.",
      avatar: "/api/placeholder/150/150",
      availability: {
        "2024-12-02": ["10:00 AM", "2:00 PM", "5:00 PM"],
        "2024-12-03": ["8:00 AM", "12:00 PM", "4:00 PM"],
        "2024-12-04": ["9:00 AM", "1:00 PM", "3:00 PM"]
      },
      nextAvailable: "Today at 5:00 PM"
    },
    {
      id: 5,
      name: "John Mwangi",
      subjects: ["Programming", "Web Development"],
      rating: 4.5,
      students: 98,
      experience: "4 years",
      price: "KSh 900/hour",
      languages: ["English", "Swahili"],
      university: "Technical University of Kenya",
      description: "Full-stack developer teaching modern web development and programming fundamentals.",
      avatar: "/api/placeholder/150/150",
      availability: {
        "2024-12-02": ["9:00 AM", "3:00 PM", "6:00 PM"],
        "2024-12-03": ["10:00 AM", "1:00 PM", "5:00 PM"],
        "2024-12-04": ["11:00 AM", "2:00 PM", "4:00 PM"]
      },
      nextAvailable: "Tomorrow at 10:00 AM"
    }
  ];

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutor.subjects.some(subject => 
                           subject.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesSubject = selectedSubject === "all" || 
                          tutor.subjects.some(subject => 
                            subject.toLowerCase().includes(selectedSubject.toLowerCase())
                          );
    return matchesSearch && matchesSubject;
  });

  const getAvailabilityForDate = (tutorId: number, date: Date) => {
    const tutor = tutors.find(t => t.id === tutorId);
    const dateStr = date.toISOString().split('T')[0];
    return tutor?.availability[dateStr] || [];
  };

  const handleBookSession = (tutorId: number, time: string) => {
    console.log(`Booking session with tutor ${tutorId} at ${time}`);
    // Mock booking functionality - in real app would integrate with calendar API
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
                <h1 className="text-2xl font-bold text-gray-900">Browse Tutors</h1>
                <p className="text-gray-600">Find and book expert tutors for live sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/student-dashboard">
                <Button variant="outline" size="sm">My Dashboard</Button>
              </Link>
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
              {filteredTutors.map((tutor) => (
                <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tutor Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback>
                              {tutor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold">{tutor.name}</h3>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="font-medium">{tutor.rating}</span>
                                <span className="text-gray-600 ml-1">({tutor.students} students)</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex flex-wrap gap-2">
                                {tutor.subjects.map((subject, index) => (
                                  <Badge key={index} variant="secondary">{subject}</Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{tutor.experience} experience</span>
                                <span>•</span>
                                <span>{tutor.university}</span>
                                <span>•</span>
                                <span className="font-semibold text-blue-600">{tutor.price}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Languages:</span>
                                {tutor.languages.map((lang, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4">{tutor.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-green-600">
                                <Clock className="h-4 w-4 mr-1" />
                                Next available: {tutor.nextAvailable}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTutor(selectedTutor === tutor.id ? null : tutor.id)}
                                >
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  {selectedTutor === tutor.id ? 'Hide Calendar' : 'View Calendar'}
                                </Button>
                                <Link to={`/live-tutoring/tutor-${tutor.id}`}>
                                  <Button size="sm">
                                    <Video className="h-4 w-4 mr-2" />
                                    Book Session
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Calendar View */}
                        {selectedTutor === tutor.id && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-4">Available Time Slots</h4>
                            <div className="grid md:grid-cols-2 gap-6">
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
                                  <h5 className="font-medium mb-3">
                                    Available slots for {selectedDate.toDateString()}
                                  </h5>
                                  <div className="space-y-2">
                                    {getAvailabilityForDate(tutor.id, selectedDate).map((time, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => handleBookSession(tutor.id, time)}
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        {time}
                                      </Button>
                                    ))}
                                    {getAvailabilityForDate(tutor.id, selectedDate).length === 0 && (
                                      <p className="text-gray-600 text-sm">No available slots for this date</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
