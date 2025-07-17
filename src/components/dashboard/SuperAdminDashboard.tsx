
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, DollarSign, TrendingUp, Settings, Eye, UserCheck, AlertTriangle, Search, FileText, GraduationCap } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type KycDocumentWithProfile = {
  id: string;
  tutor_id: string;
  document_type: string;
  document_url: string;
  status: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  notes: string | null;
  academic_qualification_type: string | null;
  tutor_profile?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
};

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<KycDocumentWithProfile | null>(null);

  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch all profiles for user management
  const { data: allProfiles } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch all KYC documents with tutor profiles
  const { data: allKycDocuments } = useQuery({
    queryKey: ['all-kyc-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;

      // Fetch tutor profiles separately
      if (data && data.length > 0) {
        const tutorIds = [...new Set(data.map(doc => doc.tutor_id))];
        const { data: tutorProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', tutorIds);

        if (profileError) throw profileError;

        // Combine the data
        return data.map(doc => ({
          ...doc,
          tutor_profile: tutorProfiles?.find(profile => profile.id === doc.tutor_id)
        })) as KycDocumentWithProfile[];
      }

      return [] as KycDocumentWithProfile[];
    }
  });

  // Fetch courses for platform metrics
  const { data: allCourses } = useQuery({
    queryKey: ['all-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch live sessions
  const { data: liveSessions } = useQuery({
    queryKey: ['live-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .order('scheduled_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const totalUsers = allProfiles?.length || 0;
  const totalTutors = allProfiles?.filter(p => p.role === 'tutor').length || 0;
  const totalStudents = allProfiles?.filter(p => p.role === 'student').length || 0;
  const pendingKyc = allKycDocuments?.filter(doc => doc.status === 'pending').length || 0;
  const totalCourses = allCourses?.length || 0;
  const publishedCourses = allCourses?.filter(c => c.is_published).length || 0;
  const activeSessions = liveSessions?.filter(s => s.status === 'live').length || 0;

  // Filter KYC documents based on search
  const filteredKyc = allKycDocuments?.filter(doc => 
    doc.tutor_profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tutor_profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocumentTypeIcon = (type: string) => {
    if (type.includes('academic') || type.includes('degree') || type.includes('certificate')) {
      return <GraduationCap className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-green-500" />;
  };

  const getDocumentTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'id_card': 'National ID Card',
      'passport': 'Passport',
      'driving_license': 'Driving License',
      'academic_qualification': 'Academic Qualification',
      'certificate': 'Teaching Certificate',
      'degree': 'Academic Degree'
    };
    return typeMap[type] || type.replace('_', ' ').toUpperCase();
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Manage the entire TUTAGORA platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">Super Admin</Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
              <p className="text-xs text-gray-500">Active platform users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Active Tutors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalTutors}</div>
              <p className="text-xs text-gray-500">Verified educators</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalCourses}</div>
              <p className="text-xs text-gray-500">{publishedCourses} published</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Pending KYC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingKyc}</div>
              <p className="text-xs text-gray-500">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kyc">KYC Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Registrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allProfiles?.slice(0, 5).map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {profile.first_name?.[0]}{profile.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{profile.first_name} {profile.last_name}</h3>
                            <p className="text-gray-600 text-sm">{profile.user_type} • {profile.country}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={profile.role === 'tutor' ? 'default' : 'secondary'}>
                            {profile.role}
                          </Badge>
                          <p className="text-gray-600 text-sm mt-1">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Sessions</span>
                      <span className="font-semibold text-green-600">{activeSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Courses</span>
                      <span className="font-semibold text-blue-600">{totalCourses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Published</span>
                      <span className="font-semibold text-green-600">{publishedCourses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending KYC</span>
                      <span className="font-semibold text-orange-600">{pendingKyc}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>KYC Document Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search by tutor name or document type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredKyc?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No KYC documents found.
                    </div>
                  ) : (
                    filteredKyc?.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          {getDocumentTypeIcon(doc.document_type)}
                          <div>
                            <h3 className="font-semibold">
                              {doc.tutor_profile?.first_name} {doc.tutor_profile?.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getDocumentTypeLabel(doc.document_type)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Submitted: {new Date(doc.submitted_at).toLocaleDateString()}
                            </p>
                            {doc.academic_qualification_type && (
                              <p className="text-xs text-blue-600">
                                Qualification: {doc.academic_qualification_type}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(doc.status)}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>
                                  KYC Document - {doc.tutor_profile?.first_name} {doc.tutor_profile?.last_name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                  <img 
                                    src={doc.document_url} 
                                    alt="KYC Document"
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="hidden text-gray-500 text-center">
                                    <FileText className="h-16 w-16 mb-2 mx-auto" />
                                    <p>Document preview not available</p>
                                    <a 
                                      href={doc.document_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View Document
                                    </a>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div><strong>Document Type:</strong> {getDocumentTypeLabel(doc.document_type)}</div>
                                  <div><strong>Status:</strong> {doc.status || 'Pending'}</div>
                                  <div><strong>Submitted:</strong> {new Date(doc.submitted_at).toLocaleDateString()}</div>
                                  <div><strong>Reviewed:</strong> {doc.reviewed_at ? new Date(doc.reviewed_at).toLocaleDateString() : 'Not reviewed'}</div>
                                  {doc.academic_qualification_type && (
                                    <div className="col-span-2">
                                      <strong>Academic Qualification:</strong> {doc.academic_qualification_type}
                                    </div>
                                  )}
                                  {doc.notes && (
                                    <div className="col-span-2">
                                      <strong>Notes:</strong> {doc.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users ({totalUsers})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allProfiles?.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{profile.first_name} {profile.last_name}</h3>
                          <p className="text-gray-600 text-sm">{profile.user_type} • {profile.country}</p>
                          <p className="text-xs text-gray-500">Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div>
                          <Badge variant={profile.role === 'tutor' ? 'default' : 'secondary'}>
                            {profile.role}
                          </Badge>
                        </div>
                        {profile.role === 'tutor' && (
                          <Badge 
                            variant={profile.kyc_status === 'approved' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            KYC: {profile.kyc_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Management ({totalCourses} total, {publishedCourses} published)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allCourses?.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-gray-600 text-sm">{course.subject} • {course.level}</p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(course.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={course.is_published ? 'default' : 'secondary'}>
                          {course.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        {course.price && (
                          <p className="text-sm font-semibold text-green-600">
                            ${course.price}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Platform Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.length === 0 ? (
                    <p className="text-gray-500">No analytics data available yet.</p>
                  ) : (
                    analytics?.slice(0, 10).map((metric) => (
                      <div key={metric.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{metric.metric_name}</span>
                          <p className="text-xs text-gray-500">{metric.metric_date}</p>
                        </div>
                        <span className="text-blue-600 font-bold">{metric.metric_value}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
