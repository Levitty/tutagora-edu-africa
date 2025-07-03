
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Settings, Plus, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";

const TutorAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const weeklySchedule = [
    { day: "Monday", slots: ["09:00-10:00", "14:00-15:00", "16:00-17:00"] },
    { day: "Tuesday", slots: ["10:00-11:00", "15:00-16:00"] },
    { day: "Wednesday", slots: ["09:00-10:00", "11:00-12:00", "14:00-15:00"] },
    { day: "Thursday", slots: ["10:00-11:00", "16:00-17:00"] },
    { day: "Friday", slots: ["09:00-10:00", "13:00-14:00", "15:00-16:00"] },
    { day: "Saturday", slots: ["10:00-11:00", "11:00-12:00"] },
    { day: "Sunday", slots: ["14:00-15:00"] }
  ];

  const upcomingBookings = [
    {
      id: 1,
      student: "John Kamau",
      subject: "Mathematics",
      date: "Dec 15, 2024",
      time: "14:00-15:00",
      type: "1-on-1",
      status: "confirmed"
    },
    {
      id: 2,
      student: "Sarah Oduya",
      subject: "Physics",
      date: "Dec 16, 2024",
      time: "16:00-17:00",
      type: "Group",
      status: "pending"
    },
    {
      id: 3,
      student: "Ahmed Hassan",
      subject: "Chemistry",
      date: "Dec 17, 2024",
      time: "10:00-11:00",
      type: "1-on-1",
      status: "confirmed"
    }
  ];

  const groupClasses = [
    {
      id: 1,
      title: "KCSE Mathematics Prep",
      description: "Intensive preparation for KCSE Mathematics exam",
      schedule: "Mon, Wed, Fri - 16:00-17:00",
      students: 15,
      maxStudents: 20,
      price: "KSh 2,500/month",
      status: "active"
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      description: "Core physics concepts for high school students",
      schedule: "Tue, Thu - 15:00-16:00",
      students: 12,
      maxStudents: 15,
      price: "KSh 2,000/month",
      status: "active"
    },
    {
      id: 3,
      title: "Chemistry Lab Techniques",
      description: "Practical chemistry for advanced students",
      schedule: "Saturday - 10:00-12:00",
      students: 8,
      maxStudents: 12,
      price: "KSh 3,000/month",
      status: "draft"
    }
  ];

  const toggleTimeSlot = (time: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TUTAGORA</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/tutor-dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link to="/tutor-availability" className="text-blue-600 font-semibold">Availability</Link>
              <Link to="/course-creation" className="text-gray-700 hover:text-blue-600">Create Course</Link>
            </nav>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Your Availability</h1>
          <p className="text-gray-600 mt-2">Set your available time slots and manage group classes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar and Time Slots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Set Available Dates
                </CardTitle>
                <CardDescription>Select dates when you're available to teach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Available Time Slots
                </CardTitle>
                <CardDescription>
                  {selectedDate ? `Select time slots for ${selectedDate.toDateString()}` : "Select a date first"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTimeSlots.includes(time) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTimeSlot(time)}
                      className="h-10"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setSelectedTimeSlots([])}>
                    Clear All
                  </Button>
                  <Button>
                    Save Availability
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Schedule Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule Overview</CardTitle>
                <CardDescription>Your current weekly availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklySchedule.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{schedule.day}</div>
                      <div className="flex flex-wrap gap-2">
                        {schedule.slots.length > 0 ? (
                          schedule.slots.map((slot, slotIndex) => (
                            <Badge key={slotIndex} variant="secondary">
                              {slot}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No availability</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{booking.student}</h4>
                        <p className="text-sm text-gray-600">{booking.subject}</p>
                      </div>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{booking.date}</p>
                      <p>{booking.time} • {booking.type}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookings</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Slots</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Classes</span>
                  <span className="font-semibold">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Group Classes Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Group Classes</h2>
              <p className="text-gray-600">Manage your group classes and recurring sessions</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group Class
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupClasses.map((groupClass) => (
              <Card key={groupClass.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{groupClass.title}</CardTitle>
                    <Badge variant={groupClass.status === 'active' ? 'default' : 'secondary'}>
                      {groupClass.status}
                    </Badge>
                  </div>
                  <CardDescription>{groupClass.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {groupClass.schedule}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {groupClass.students}/{groupClass.maxStudents} students
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {groupClass.price}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorAvailability;
