
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Settings, Plus, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyAvailability, useCreateAvailability, useDeleteAvailability } from "@/hooks/useTutorAvailability";
import { toast } from "sonner";

const TutorAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday = 1
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  
  const { data: availability, isLoading } = useMyAvailability();
  const createAvailabilityMutation = useCreateAvailability();
  const deleteAvailabilityMutation = useDeleteAvailability();

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const daysOfWeek = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" }
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

  const handleAddAvailability = async () => {
    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      await createAvailabilityMutation.mutateAsync({
        day_of_week: selectedDay,
        start_time: startTime,
        end_time: endTime,
        is_available: true
      });
      
      // Reset form
      setSelectedDay(1);
      setStartTime("09:00");
      setEndTime("10:00");
    } catch (error) {
      console.error("Error adding availability:", error);
    }
  };

  const handleRemoveAvailability = async (id: string) => {
    try {
      await deleteAvailabilityMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error removing availability:", error);
    }
  };

  const groupedAvailability = availability?.reduce((acc, slot) => {
    const day = slot.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {} as Record<number, typeof availability>) || {};

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
          <p className="text-gray-600 mt-2">Set your available time slots for tutoring sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Availability */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Availability
                </CardTitle>
                <CardDescription>Create a new weekly availability slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Day of Week</label>
                    <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleAddAvailability}
                  disabled={createAvailabilityMutation.isPending}
                  className="w-full"
                >
                  {createAvailabilityMutation.isPending ? "Adding..." : "Add Availability Slot"}
                </Button>
              </CardContent>
            </Card>

            {/* Current Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Current Weekly Schedule</CardTitle>
                <CardDescription>Your current availability across the week</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading availability...</div>
                ) : (
                  <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                      <div key={day.value} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">{day.label}</div>
                        <div className="flex flex-wrap gap-2">
                          {groupedAvailability[day.value]?.length > 0 ? (
                            groupedAvailability[day.value].map((slot) => (
                              <div key={slot.id} className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAvailability(slot.id)}
                                  disabled={deleteAvailabilityMutation.isPending}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No availability</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <span className="text-gray-600">Available Slots</span>
                  <span className="font-semibold">{availability?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookings</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Open Slots</span>
                  <span className="font-semibold">{Math.max(0, (availability?.length || 0) - 3)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorAvailability;
