import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, BookOpen, Users, Clock, Video, Star, DollarSign, Upload, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

export const TutorDashboard = () => {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [teachingExperience, setTeachingExperience] = useState("");
  const [educationBackground, setEducationBackground] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const subjectOptions = [
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "english", label: "English" },
    { value: "kiswahili", label: "Kiswahili" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "business_studies", label: "Business Studies" },
    { value: "economics", label: "Economics" },
    { value: "accounting", label: "Accounting" },
    { value: "computer_studies", label: "Computer Studies" },
    { value: "programming", label: "Programming" },
    { value: "acca", label: "ACCA" },
    { value: "cpa", label: "CPA" },
    { value: "statistics", label: "Statistics" },
    { value: "agriculture", label: "Agriculture" },
    { value: "art_design", label: "Art & Design" },
    { value: "music", label: "Music" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "arabic", label: "Arabic" }
  ];

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setHourlyRate(profile.hourly_rate ? profile.hourly_rate.toString() : "");
      setTeachingExperience(profile.teaching_experience || "");
      setEducationBackground(profile.education_background || "");
      setSelectedSubjects(profile.preferred_subjects || []);
    }
  }, [profile]);

  useEffect(() => {
    if (user?.id && !profileLoading) {
      refetchProfile();
    }
  }, [user?.id, refetchProfile, profileLoading]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHourlyRate(e.target.value);
  };

  const handleTeachingExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeachingExperience(e.target.value);
  };

  const handleEducationBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEducationBackground(e.target.value);
  };

  const handleSubjectsChange = (values: string[]) => {
    setSelectedSubjects(values);
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
        profile_photo_url?: string;
      } = {
        bio,
        hourly_rate: parseFloat(hourlyRate),
        teaching_experience,
        education_background,
        preferred_subjects: selectedSubjects,
      };

      if (profilePhoto) {
        const filePath = `profile-photos/${user.id}/${profilePhoto.name}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, profilePhoto, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Error uploading profile photo: ${uploadError.message}`);
        }

        const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`;
        updates.profile_photo_url = publicURL;
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
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
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
                            ? `$${profile?.hourly_rate.toFixed(2)}`
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
                        <span className="text-gray-600">Subjects:</span>
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
                      onChange={handleBioChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input
                      type="number"
                      id="hourlyRate"
                      placeholder="Enter your hourly rate"
                      value={hourlyRate}
                      onChange={handleHourlyRateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teachingExperience">Teaching Experience</Label>
                    <Input
                      type="text"
                      id="teachingExperience"
                      placeholder="Enter your teaching experience"
                      value={teachingExperience}
                      onChange={handleTeachingExperienceChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="educationBackground">Education Background</Label>
                    <Input
                      type="text"
                      id="educationBackground"
                      placeholder="Enter your education background"
                      value={educationBackground}
                      onChange={handleEducationBackgroundChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Preferred Subjects</Label>
                    <MultiSelect
                      options={subjectOptions}
                      value={selectedSubjects}
                      onChange={handleSubjectsChange}
                    />
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
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>
                  Manage and create your courses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
                <CardDescription>
                  View and manage your tutoring sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
                <CardDescription>
                  Track your earnings and payment history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
