import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, Users, Video, Award, Settings, AlertTriangle, CheckCircle, Upload, DollarSign, Star, TrendingUp, Camera, Clock, Phone, Mail, MapPin, Edit, Plus, Trash2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useBookings } from "@/hooks/useBookings";
import { useMyAvailability, useCreateAvailability, useDeleteAvailability } from "@/hooks/useTutorAvailability";
import { TutorOnboarding } from "@/components/tutor/TutorOnboarding";
import VideoUpload from "@/components/tutor/VideoUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const TutorDashboard = () => {
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { data: bookings } = useBookings();
  const { data: availability } = useMyAvailability();
  const createAvailability = useCreateAvailability();
  const deleteAvailability = useDeleteAvailability();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const kycStatus = profile?.kyc_status || 'pending';
  const isKycApproved = kycStatus === 'approved';
  const [showKYC, setShowKYC] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showGroupClass, setShowGroupClass] = useState(false);
  
  // Availability management state
  const [availabilityForm, setAvailabilityForm] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
    is_available: true
  });

  // Group class state
  const [groupClassForm, setGroupClassForm] = useState({
    title: '',
    description: '',
    subject: '',
    max_students: '',
    price: '',
    duration_minutes: '',
    schedule: ''
  });
  
  // Profile editing state - sync with profile data
  const [editProfile, setEditProfile] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    hourly_rate: '',
    phone: '',
    expertise: [],
    specializations: [],
    teaching_experience: '',
    education_background: '',
    preferred_subjects: [],
    certifications: []
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setEditProfile({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        hourly_rate: profile.hourly_rate?.toString() || '',
        phone: profile.phone || '',
        expertise: Array.isArray(profile.expertise) ? profile.expertise : [],
        specializations: Array.isArray(profile.specializations) ? profile.specializations : [],
        teaching_experience: profile.teaching_experience || '',
        education_background: profile.education_background || '',
        preferred_subjects: Array.isArray(profile.preferred_subjects) ? profile.preferred_subjects : [],
        certifications: Array.isArray(profile.certifications) ? profile.certifications : []
      });
    }
  }, [profile]);

  // Profile photo upload mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully!" });
      refetchProfile();
      setShowProfileEdit(false);
    },
    onError: (error) => {
      toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
    }
  });

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}/avatar.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      await updateProfileMutation.mutateAsync({ profile_photo_url: urlData.publicUrl });
    } catch (error: any) {
      toast({ title: "Error uploading photo", description: error.message, variant: "destructive" });
    }
  };

  const tutorBookings = bookings?.filter(booking => booking.tutor_id === profile?.id) || [];
  const todaysBookings = tutorBookings.filter(booking => {
    const today = new Date().toDateString();
    return new Date(booking.scheduled_at).toDateString() === today;
  });

  const monthlyStats = {
    totalEarnings: tutorBookings
      .filter(b => b.payment_status === 'completed')
      .reduce((sum, b) => sum + Number(b.total_amount), 0),
    pendingPayouts: tutorBookings
      .filter(b => b.payment_status === 'pending')
      .reduce((sum, b) => sum + Number(b.total_amount), 0),
    completedSessions: tutorBookings.filter(b => b.status === 'completed').length,
    totalStudents: new Set(tutorBookings.map(b => b.student_id)).size,
    averageRating: 4.8, // TODO: Calculate from actual ratings
    activeCourses: 0, // TODO: Get from courses
    responseTime: "2.3 min"
  };

  const handleStartKYC = () => {
    setShowKYC(true);
  };

  const handleAddAvailability = () => {
    if (!availabilityForm.day_of_week || !availabilityForm.start_time || !availabilityForm.end_time) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    createAvailability.mutate({
      day_of_week: parseInt(availabilityForm.day_of_week),
      start_time: availabilityForm.start_time,
      end_time: availabilityForm.end_time,
      is_available: availabilityForm.is_available
    });

    setAvailabilityForm({
      day_of_week: '',
      start_time: '',
      end_time: '',
      is_available: true
    });
  };

  const handleDeleteAvailability = (id: string) => {
    deleteAvailability.mutate(id);
  };

  const handleCreateGroupClass = async () => {
    if (!groupClassForm.title || !groupClassForm.subject || !groupClassForm.price) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('live_sessions')
        .insert({
          tutor_id: profile?.id,
          title: groupClassForm.title,
          duration_minutes: parseInt(groupClassForm.duration_minutes) || 60,
          scheduled_at: new Date().toISOString(),
          status: 'scheduled'
        });

      if (error) throw error;
      
      toast({ title: "Group class created successfully!" });
      setShowGroupClass(false);
      setGroupClassForm({
        title: '',
        description: '',
        subject: '',
        max_students: '',
        price: '',
        duration_minutes: '',
        schedule: ''
      });
    } catch (error: any) {
      toast({ title: "Error creating group class", description: error.message, variant: "destructive" });
    }
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Available subjects for selection
  const subjectOptions = [
    'Mathematics',
    'English', 
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Programming',
    'ACCA',
    'Business Studies',
    'Economics',
    'History',
    'Geography',
    'Literature',
    'Art',
    'Music',
    'French',
    'Spanish',
    'German',
    'Kiswahili',
    'Psychology',
    'Philosophy',
    'Statistics',
    'Accounting',
    'Government',
    'Physical Education'
  ];

  if (!isKycApproved) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {profile?.first_name || 'Tutor'}!
                  </h1>
                  <p className="text-gray-600">Complete your verification to start tutoring</p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`
                  ${kycStatus === 'pending' ? 'bg-orange-100 text-orange-800' : 
                    kycStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}
                `}
              >
                KYC: {kycStatus}
              </Badge>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TutorOnboarding kycStatus={kycStatus} onStartKYC={handleStartKYC} />
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
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {profile?.first_name || 'Tutor'}!
                </h1>
                <p className="text-gray-600">Ready to inspire minds today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Students</p>
                  <p className="text-3xl font-bold">{monthlyStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Monthly Earnings</p>
                  <p className="text-3xl font-bold">KSh {monthlyStats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Active Courses</p>
                  <p className="text-3xl font-bold">{monthlyStats.activeCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Average Rating</p>
                  <p className="text-3xl font-bold">{monthlyStats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="group-classes">Group Classes</TabsTrigger>
            <TabsTrigger value="videos">Video Content</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Sessions */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Today's Sessions
                      </span>
                      <span className="text-sm text-gray-500">
                        Total: KSh {todaysBookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todaysBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No sessions scheduled for today</p>
                      </div>
                    ) : (
                      todaysBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>ST</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">Student</h3>
                              <p className="text-gray-600 text-sm">{booking.subject}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-green-600 text-sm">KSh {Number(booking.total_amount).toLocaleString()}</p>
                            <Badge 
                              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                              className="mt-1"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Video className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Profile Management Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Edit className="h-5 w-5 mr-2" />
                        Profile Management
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile?.profile_photo_url} />
                          <AvatarFallback className="text-lg">
                            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <label htmlFor="photo-upload" className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
                          <Camera className="h-4 w-4" />
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePhotoUpload}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{profile?.first_name} {profile?.last_name}</h3>
                        <p className="text-gray-600">{profile?.bio || 'No bio added yet'}</p>
                        <p className="text-green-600 font-medium">KSh {profile?.hourly_rate || 0}/hour</p>
                      </div>
                      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                         <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                           <DialogHeader>
                             <DialogTitle>Edit Profile</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <Label htmlFor="first_name">First Name</Label>
                                 <Input
                                   id="first_name"
                                   value={editProfile.first_name}
                                   onChange={(e) => setEditProfile(prev => ({ ...prev, first_name: e.target.value }))}
                                 />
                               </div>
                               <div>
                                 <Label htmlFor="last_name">Last Name</Label>
                                 <Input
                                   id="last_name"
                                   value={editProfile.last_name}
                                   onChange={(e) => setEditProfile(prev => ({ ...prev, last_name: e.target.value }))}
                                 />
                               </div>
                               <div>
                                 <Label htmlFor="phone">Phone</Label>
                                 <Input
                                   id="phone"
                                   value={editProfile.phone}
                                   onChange={(e) => setEditProfile(prev => ({ ...prev, phone: e.target.value }))}
                                 />
                               </div>
                               <div>
                                 <Label htmlFor="hourly_rate">Hourly Rate (KSh)</Label>
                                 <Input
                                   id="hourly_rate"
                                   type="number"
                                   value={editProfile.hourly_rate}
                                   onChange={(e) => setEditProfile(prev => ({ ...prev, hourly_rate: e.target.value }))}
                                 />
                               </div>
                             </div>
                             <div>
                               <Label htmlFor="bio">Bio</Label>
                               <Textarea
                                 id="bio"
                                 value={editProfile.bio}
                                 onChange={(e) => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                                 placeholder="Tell students about yourself..."
                               />
                             </div>
                             <div>
                               <Label htmlFor="teaching_experience">Teaching Experience</Label>
                               <Textarea
                                 id="teaching_experience"
                                 value={editProfile.teaching_experience}
                                 onChange={(e) => setEditProfile(prev => ({ ...prev, teaching_experience: e.target.value }))}
                                 placeholder="Describe your teaching experience..."
                               />
                             </div>
                             <div>
                               <Label htmlFor="education_background">Education Background</Label>
                               <Textarea
                                 id="education_background"
                                 value={editProfile.education_background}
                                 onChange={(e) => setEditProfile(prev => ({ ...prev, education_background: e.target.value }))}
                                 placeholder="Your educational qualifications..."
                               />
                             </div>
                               <div>
                                 <Label htmlFor="expertise">Areas of Expertise</Label>
                                 <MultiSelect
                                   options={subjectOptions}
                                   value={editProfile.expertise || []}
                                   onChange={(value) => setEditProfile(prev => ({ ...prev, expertise: value }))}
                                   placeholder="Select your areas of expertise..."
                                 />
                               </div>
                               <div>
                                 <Label htmlFor="preferred_subjects">Preferred Teaching Subjects</Label>
                                 <MultiSelect
                                   options={subjectOptions}
                                   value={editProfile.preferred_subjects || []}
                                   onChange={(value) => setEditProfile(prev => ({ ...prev, preferred_subjects: value }))}
                                   placeholder="Select subjects you prefer to teach..."
                                 />
                               </div>
                              <div>
                                <Label htmlFor="specializations">Specializations</Label>
                                <MultiSelect
                                  options={['STEM', 'Languages', 'Arts', 'Sciences', 'Humanities', 'Business', 'Technology']}
                                  value={editProfile.specializations || []}
                                  onChange={(value) => setEditProfile(prev => ({ ...prev, specializations: value }))}
                                  placeholder="Select your specializations..."
                                />
                              </div>
                              <div>
                                <Label htmlFor="certifications">Certifications</Label>
                                <Textarea
                                  id="certifications"
                                  value={Array.isArray(editProfile.certifications) ? editProfile.certifications.join(', ') : editProfile.certifications || ''}
                                  onChange={(e) => setEditProfile(prev => ({ 
                                    ...prev, 
                                    certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                                  }))}
                                  placeholder="Enter your certifications separated by commas"
                                />
                              </div>
                           </div>
                          <div className="flex justify-end space-x-2 mt-6">
                            <Button variant="outline" onClick={() => setShowProfileEdit(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => updateProfileMutation.mutate(editProfile)}
                              disabled={updateProfileMutation.isPending}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions & Earnings */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/course-creation">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Create New Course
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12"
                      onClick={() => setShowProfileEdit(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12"
                      onClick={() => setShowGroupClass(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Create Group Class
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Bookings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Earnings Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Earnings</span>
                      <span className="font-semibold text-green-600">KSh {monthlyStats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Payout</span>
                      <span className="font-semibold text-orange-500">KSh {monthlyStats.pendingPayouts.toLocaleString()}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Request Payout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <VideoUpload />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-muted-foreground mb-4">No courses created yet</p>
                  <Link to="/course-creation">
                    <Button>Create Your First Course</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Manage Availability
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Availability */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Add Available Time Slot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="day_of_week">Day of Week</Label>
                      <Select value={availabilityForm.day_of_week} onValueChange={(value) => setAvailabilityForm(prev => ({ ...prev, day_of_week: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {dayNames.map((day, index) => (
                            <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={availabilityForm.start_time}
                        onChange={(e) => setAvailabilityForm(prev => ({ ...prev, start_time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={availabilityForm.end_time}
                        onChange={(e) => setAvailabilityForm(prev => ({ ...prev, end_time: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddAvailability} disabled={createAvailability.isPending}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Slot
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Current Availability */}
                <div>
                  <h3 className="font-semibold mb-4">Current Availability</h3>
                  {availability && availability.length > 0 ? (
                    <div className="space-y-2">
                      {availability.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="font-medium">{dayNames[slot.day_of_week]}</div>
                            <div className="text-gray-600">
                              {slot.start_time} - {slot.end_time}
                            </div>
                            <Badge variant={slot.is_available ? "default" : "secondary"}>
                              {slot.is_available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAvailability(slot.id)}
                            disabled={deleteAvailability.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No availability slots set yet</p>
                      <p className="text-sm">Add your available times above to let students book sessions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="group-classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Group Classes
                  </span>
                  <Dialog open={showGroupClass} onOpenChange={setShowGroupClass}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Group Class
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Group Class</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="title">Class Title</Label>
                          <Input
                            id="title"
                            value={groupClassForm.title}
                            onChange={(e) => setGroupClassForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., KCSE Mathematics Preparation"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={groupClassForm.description}
                            onChange={(e) => setGroupClassForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe what students will learn..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={groupClassForm.subject}
                            onChange={(e) => setGroupClassForm(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="e.g., Mathematics"
                          />
                        </div>
                        <div>
                          <Label htmlFor="max_students">Max Students</Label>
                          <Input
                            id="max_students"
                            type="number"
                            value={groupClassForm.max_students}
                            onChange={(e) => setGroupClassForm(prev => ({ ...prev, max_students: e.target.value }))}
                            placeholder="e.g., 10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price per Student (KSh)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={groupClassForm.price}
                            onChange={(e) => setGroupClassForm(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="e.g., 500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                          <Input
                            id="duration_minutes"
                            type="number"
                            value={groupClassForm.duration_minutes}
                            onChange={(e) => setGroupClassForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                            placeholder="e.g., 90"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={() => setShowGroupClass(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateGroupClass}>
                          Create Class
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No group classes created yet</p>
                  <p className="text-sm">Create your first group class to teach multiple students together</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{monthlyStats.completedSessions}</p>
                    <p className="text-sm text-gray-600">Completed Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{monthlyStats.totalStudents}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{monthlyStats.averageRating}⭐</p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{monthlyStats.responseTime}</p>
                    <p className="text-sm text-gray-600">Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
