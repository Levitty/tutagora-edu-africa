
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, BookOpen, Users, Clock, Video, Star, DollarSign, Upload, Search, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMyAvailability, useCreateAvailability } from "@/hooks/useTutorAvailability";
import { useBookings } from "@/hooks/useBookings";

const SUBJECTS = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology", "History", 
  "Geography", "Economics", "Business Studies", "Accounting", "Computer Science",
  "Programming", "Web Development", "Software Engineering", "Data Science",
  "Statistics", "Kiswahili", "French", "German", "Spanish", "Art & Design",
  "Music", "Physical Education", "Religious Studies", "Philosophy", "Psychology",
  "Sociology", "Political Science", "Literature", "Creative Writing", "Public Speaking"
];

const SPECIALIZATIONS = [
  "KCSE Preparation", "IGCSE", "A-Level", "University Level", "Professional Certification",
  "Beginner Level", "Intermediate Level", "Advanced Level", "Adult Learning",
  "Special Needs Education", "Online Teaching", "Group Classes", "One-on-One Tutoring",
  "Exam Preparation", "Homework Help", "Project Assistance", "Research Methods"
];

export const TutorDashboard = () => {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { data: availability } = useMyAvailability();
  const createAvailabilityMutation = useCreateAvailability();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleStartClass = async (booking: any) => {
    try {
      // Create a live session
      const { data: liveSession, error } = await supabase
        .from('live_sessions')
        .insert({
          tutor_id: user?.id,
          title: `${booking.subject} Session with ${booking.student?.first_name || 'Student'}`,
          scheduled_at: booking.scheduled_at,
          duration_minutes: booking.duration_minutes,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Redirect to live classes page
      window.open('/live-tutoring', '_blank');

      toast.success("Class Started", {
        description: "Live session has been created successfully. Students can now join.",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to start class",
      });
    }
  };
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [teachingExperience, setTeachingExperience] = useState("");
  const [educationBackground, setEducationBackground] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Filter bookings for this tutor
  const tutorBookings = bookings?.filter(booking => booking.tutor_id === user?.id) || [];

  // Calculate real earnings from confirmed bookings
  const confirmedBookings = tutorBookings.filter(booking => booking.payment_status === 'paid');
  const totalEarnings = confirmedBookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0);
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  const thisMonthEarnings = confirmedBookings
    .filter(booking => new Date(booking.created_at) >= thisMonthStart)
    .reduce((sum, booking) => sum + Number(booking.total_amount), 0);
  const upcomingBookings = tutorBookings.filter(booking => 
    (booking.status === 'confirmed' || booking.payment_status === 'paid') && 
    new Date(booking.scheduled_at) > new Date()
  );
  
  const quickStats = {
    totalEarnings,
    monthlyEarnings: thisMonthEarnings,
    totalSessions: tutorBookings.length,
    upcomingSessions: upcomingBookings.length,
    completionRate: tutorBookings.length > 0 ? 
      Math.round((tutorBookings.filter(b => b.status === 'completed').length / tutorBookings.length) * 100) : 0
  };

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setHourlyRate(profile.hourly_rate ? profile.hourly_rate.toString() : "");
      setTeachingExperience(profile.teaching_experience || "");
      setEducationBackground(profile.education_background || "");
      setSelectedSubjects(Array.isArray(profile.preferred_subjects) ? profile.preferred_subjects : []);
      setSelectedExpertise(Array.isArray(profile.expertise) ? profile.expertise : []);
      setSelectedSpecializations(Array.isArray(profile.specializations) ? profile.specializations : []);
    }
  }, [profile]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubjectAdd = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubjectRemove = (subject: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
  };

  const handleSpecializationAdd = (specialization: string) => {
    if (!selectedSpecializations.includes(specialization)) {
      setSelectedSpecializations([...selectedSpecializations, specialization]);
    }
  };

  const handleSpecializationRemove = (specialization: string) => {
    setSelectedSpecializations(selectedSpecializations.filter(s => s !== specialization));
  };

  const handleExpertiseAdd = (expertise: string) => {
    if (!selectedExpertise.includes(expertise)) {
      setSelectedExpertise([...selectedExpertise, expertise]);
    }
  };

  const handleExpertiseRemove = (expertise: string) => {
    setSelectedExpertise(selectedExpertise.filter(s => s !== expertise));
  };

  const handleSubmitProfile = async () => {
    setUploading(true);
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const updates: {
        bio?: string;
        hourly_rate?: number;
        teaching_experience?: string;
        education_background?: string;
        preferred_subjects?: string[];
        expertise?: string[];
        specializations?: string[];
        profile_photo_url?: string;
      } = {
        bio,
        hourly_rate: parseFloat(hourlyRate),
        teaching_experience: teachingExperience,
        education_background: educationBackground,
        preferred_subjects: selectedSubjects,
        expertise: selectedExpertise,
        specializations: selectedSpecializations,
      };

      if (profilePhoto) {
        const filePath = `profile-photos/${user.id}/${profilePhoto.name}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(filePath, profilePhoto, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Error uploading profile photo: ${uploadError.message}`);
        }

        const { data: publicData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(filePath);
        
        updates.profile_photo_url = publicData.publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) {
        throw new Error(`Error updating profile: ${error.message}`);
      }

      toast.success("Profile updated successfully!");
      refetchProfile();
    } catch (err: any) {
      toast.error(`Failed to update profile: ${err.message}`);
    } finally {
      setUploading(false);
      setIsProfileFormOpen(false);
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Tutor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {profile?.first_name || user?.email?.split('@')[0]}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/browse-tutors">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Tutors
                </Button>
              </Link>
              <Link to="/tutor-availability">
                <Button variant="outline" size="sm">Set Availability</Button>
              </Link>
              <Button onClick={() => signOut()} variant="outline" size="sm">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">KSh {quickStats.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">KSh {quickStats.monthlyEarnings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.upcomingSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  View and manage your profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <div className="text-center">Loading profile...</div>
                ) : (
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile?.profile_photo_url} />
                        <AvatarFallback>
                          {profile?.first_name?.[0]}
                          {profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {profile?.first_name} {profile?.last_name}
                        </h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <Badge variant={profile?.kyc_status === 'approved' ? 'default' : 'secondary'}>
                          KYC: {profile?.kyc_status || 'pending'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Bio:</span>
                        <p>{profile?.bio || "No bio provided."}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Hourly Rate:</span>
                        <p>
                          {profile?.hourly_rate
                            ? `KSh ${profile?.hourly_rate.toFixed(2)}`
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Teaching Experience:</span>
                        <p>{profile?.teaching_experience || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Education:</span>
                        <p>{profile?.education_background || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Areas of Expertise:</span>
                        <div className="flex flex-wrap gap-1">
                          {(profile?.expertise || []).map((item) => (
                            <Badge key={item} variant="secondary">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Specializations:</span>
                        <div className="flex flex-wrap gap-1">
                          {(profile?.specializations || []).map((item) => (
                            <Badge key={item} variant="secondary">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Preferred Subjects:</span>
                        <div className="flex flex-wrap gap-1">
                          {(profile?.preferred_subjects || []).map((subject) => (
                            <Badge key={subject} variant="secondary">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => setIsProfileFormOpen(true)}>
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {isProfileFormOpen && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto">Profile Photo</Label>
                    <Input
                      type="file"
                      id="profilePhoto"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (KSh)</Label>
                    <Input
                      type="number"
                      id="hourlyRate"
                      placeholder="Enter your hourly rate"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teachingExperience">Teaching Experience</Label>
                    <Input
                      type="text"
                      id="teachingExperience"
                      placeholder="e.g., 5 years"
                      value={teachingExperience}
                      onChange={(e) => setTeachingExperience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="educationBackground">Education Background</Label>
                    <Input
                      type="text"
                      id="educationBackground"
                      placeholder="e.g., Bachelor of Education - Mathematics"
                      value={educationBackground}
                      onChange={(e) => setEducationBackground(e.target.value)}
                    />
                  </div>
                  
                  {/* Subjects */}
                  <div className="space-y-2">
                    <Label>Preferred Subjects</Label>
                    <Select onValueChange={handleSubjectAdd}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.filter(s => !selectedSubjects.includes(s)).map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="cursor-pointer" onClick={() => handleSubjectRemove(subject)}>
                          {subject} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Areas of Expertise */}
                  <div className="space-y-2">
                    <Label>Areas of Expertise</Label>
                    <Select onValueChange={handleExpertiseAdd}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add expertise area" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.filter(s => !selectedExpertise.includes(s)).map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpertise.map((expertise) => (
                        <Badge key={expertise} variant="secondary" className="cursor-pointer" onClick={() => handleExpertiseRemove(expertise)}>
                          {expertise} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-2">
                    <Label>Specializations</Label>
                    <Select onValueChange={handleSpecializationAdd}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATIONS.filter(s => !selectedSpecializations.includes(s)).map((specialization) => (
                          <SelectItem key={specialization} value={specialization}>
                            {specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpecializations.map((specialization) => (
                        <Badge key={specialization} variant="secondary" className="cursor-pointer" onClick={() => handleSpecializationRemove(specialization)}>
                          {specialization} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => setIsProfileFormOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitProfile}
                      disabled={uploading}
                    >
                      {uploading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  View and manage your tutoring sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center">Loading bookings...</div>
                ) : (
                  <div className="space-y-4">
                    {tutorBookings.length === 0 ? (
                      <p className="text-gray-500 text-center">No bookings yet.</p>
                    ) : (
                       tutorBookings.slice(0, 10).map((booking) => (
                         <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                           <div className="flex-1">
                             <h4 className="font-semibold">
                               {booking.student?.first_name && booking.student?.last_name 
                                 ? `${booking.student.first_name} ${booking.student.last_name}` 
                                 : 'Unknown Student'}
                             </h4>
                             <p className="text-sm text-gray-600">{booking.subject}</p>
                             <p className="text-sm text-gray-500">
                               {new Date(booking.scheduled_at).toLocaleDateString()} • {new Date(booking.scheduled_at).toLocaleTimeString()}
                             </p>
                             <p className="text-sm font-medium text-green-600">KSh {booking.total_amount}</p>
                           </div>
                            <div className="flex flex-col items-end space-y-1">
                              <div className="flex space-x-2">
                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                  {booking.status}
                                </Badge>
                                <Badge variant={booking.payment_status === 'paid' ? 'default' : 'destructive'}>
                                  {booking.payment_status}
                                </Badge>
                              </div>
                              {booking.payment_status === 'paid' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStartClass(booking)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Start Class
                                </Button>
                              )}
                            </div>
                         </div>
                       ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability Management</CardTitle>
                <CardDescription>
                  Set your available time slots for tutoring sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/tutor-availability">
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Full Availability
                    </Button>
                  </Link>
                  
                  {availability && availability.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Current Availability:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {availability.map((slot) => (
                          <div key={slot.id} className="p-2 bg-gray-50 rounded">
                            <span className="font-medium">
                              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][slot.day_of_week]}
                            </span>
                            <span className="ml-2 text-sm text-gray-600">
                              {slot.start_time} - {slot.end_time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>
                  Track your earnings and payment history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">KSh {quickStats.totalEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">KSh {quickStats.monthlyEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{quickStats.totalSessions}</div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                </div>
                <p className="text-gray-600">Detailed earnings tracking coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
