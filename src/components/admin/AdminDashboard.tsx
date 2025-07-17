
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  AlertTriangle,
  UserCheck,
  Building2,
  GraduationCap
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all profiles for admin overview
  const { data: allProfiles } = useQuery({
    queryKey: ['admin-all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch pending KYC documents
  const { data: pendingKyc } = useQuery({
    queryKey: ['admin-pending-kyc'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select(`
          *,
          profiles!kyc_documents_tutor_id_fkey(first_name, last_name, email)
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Mutation for approving/rejecting KYC
  const updateKycMutation = useMutation({
    mutationFn: async ({ documentId, status, notes }: { documentId: string; status: string; notes: string }) => {
      const { error } = await supabase
        .from('kyc_documents')
        .update({ 
          status, 
          notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', documentId);
      
      if (error) throw error;

      // Update profile KYC status if all documents are approved
      if (status === 'approved') {
        const { data: tutorDocs } = await supabase
          .from('kyc_documents')
          .select('status, tutor_id')
          .eq('id', documentId)
          .single();

        if (tutorDocs) {
          const { data: allDocs } = await supabase
            .from('kyc_documents')
            .select('status')
            .eq('tutor_id', tutorDocs.tutor_id);

          const allApproved = allDocs?.every(doc => doc.status === 'approved');
          
          if (allApproved) {
            await supabase
              .from('profiles')
              .update({ kyc_status: 'approved' })
              .eq('id', tutorDocs.tutor_id);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-kyc'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-profiles'] });
      toast({ title: "KYC document reviewed successfully" });
      setSelectedDocument(null);
      setReviewNotes("");
    },
  });

  const handleKycAction = (status: 'approved' | 'rejected') => {
    if (!selectedDocument) return;
    
    updateKycMutation.mutate({
      documentId: selectedDocument.id,
      status,
      notes: reviewNotes
    });
  };

  const stats = {
    totalUsers: allProfiles?.length || 0,
    totalTutors: allProfiles?.filter(p => p.role === 'tutor').length || 0,
    totalStudents: allProfiles?.filter(p => p.role === 'student').length || 0,
    pendingKycCount: pendingKyc?.length || 0
  };

  const filteredKyc = pendingKyc?.filter(doc => 
    doc.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocumentTypeIcon = (type: string) => {
    if (type.includes('academic') || type.includes('degree') || type.includes('certificate')) {
      return <GraduationCap className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-green-500" />;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage platform operations and tutor verification</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Super Admin
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500">Active platform users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tutors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalTutors}</div>
              <p className="text-xs text-gray-500">Registered tutors</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
              <p className="text-xs text-gray-500">Learning on platform</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending KYC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingKycCount}</div>
              <p className="text-xs text-gray-500">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="kyc" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="kyc" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending KYC Verifications</CardTitle>
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
                      No pending KYC documents found.
                    </div>
                  ) : (
                    filteredKyc?.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          {getDocumentTypeIcon(doc.document_type)}
                          <div>
                            <h3 className="font-semibold">
                              {doc.profiles?.first_name} {doc.profiles?.last_name}
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
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Review KYC Document - {doc.profiles?.first_name} {doc.profiles?.last_name}
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
                                  <div className="hidden text-gray-500">
                                    <FileText className="h-16 w-16 mb-2" />
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
                                  <div>
                                    <strong>Document Type:</strong> {getDocumentTypeLabel(doc.document_type)}
                                  </div>
                                  <div>
                                    <strong>Submitted:</strong> {new Date(doc.submitted_at).toLocaleDateString()}
                                  </div>
                                  {doc.academic_qualification_type && (
                                    <div className="col-span-2">
                                      <strong>Academic Qualification:</strong> {doc.academic_qualification_type}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Review Notes:</label>
                                  <Textarea
                                    placeholder="Add notes about this verification..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                  />
                                </div>

                                <div className="flex space-x-2">
                                  <Button 
                                    onClick={() => handleKycAction('approved')}
                                    disabled={updateKycMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    onClick={() => handleKycAction('rejected')}
                                    disabled={updateKycMutation.isPending}
                                    variant="destructive"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
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
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allProfiles?.slice(0, 10).map((profile) => (
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
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={profile.role === 'tutor' ? 'default' : 'secondary'}>
                          {profile.role}
                        </Badge>
                        {profile.role === 'tutor' && (
                          <Badge 
                            variant={profile.kyc_status === 'approved' ? 'default' : 'secondary'}
                            className="ml-2"
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

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Advanced analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
