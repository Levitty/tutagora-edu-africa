import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SuperAdminDashboard = () => {
  const { user, signOut } = useAuth();

  // Fetch platform stats
  const { data: platformStats, isLoading: statsLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_platform_stats');
      if (error) {
        console.error("Error fetching platform stats:", error);
        throw error;
      }
      return data;
    }
  });

  // Fetch recent transactions
  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recent transactions:", error);
        throw error;
      }
      return data;
    }
  });

  // Fetch KYC documents awaiting approval
  const { data: kycDocuments, isLoading: kycLoading, refetch: refetchKyc } = useQuery({
    queryKey: ['kyc-documents-pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('id, user_id, document_type, status, created_at')
        .eq('status', 'pending')
        .limit(5);

      if (error) {
        console.error("Error fetching KYC documents:", error);
        throw error;
      }
      return data;
    }
  });

  const handleApproveKyc = async (documentId: string) => {
    const { error } = await supabase
      .from('kyc_documents')
      .update({ status: 'approved' })
      .eq('id', documentId);

    if (error) {
      toast.error("Failed to approve KYC document");
      console.error("Error approving KYC document:", error);
    } else {
      toast.success("KYC document approved successfully!");
      refetchKyc(); // Refresh the KYC documents list
    }
  };

  const handleRejectKyc = async (documentId: string) => {
    const { error } = await supabase
      .from('kyc_documents')
      .update({ status: 'rejected' })
      .eq('id', documentId);

    if (error) {
      toast.error("Failed to reject KYC document");
      console.error("Error rejecting KYC document:", error);
    } else {
      toast.success("KYC document rejected successfully!");
      refetchKyc(); // Refresh the KYC documents list
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
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Platform Management & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/browse-tutors">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Tutors
                </Button>
              </Link>
              <Button onClick={() => signOut()} variant="outline" size="sm">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>All registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{platformStats?.total_users || 'Loading...'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Tutors</CardTitle>
              <CardDescription>Verified tutors on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{platformStats?.total_tutors || 'Loading...'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Platform earnings this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">KSh {platformStats?.total_revenue || 'Loading...'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link to="/admin-dashboard">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>Latest transactions on the platform</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading transactions...</TableCell>
                  </TableRow>
                ) : recentTransactions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No transactions found.</TableCell>
                  </TableRow>
                ) : (
                  recentTransactions?.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.user_id}</TableCell>
                      <TableCell>KSh {transaction.amount}</TableCell>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* KYC Documents Awaiting Approval */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>KYC Documents Awaiting Approval</CardTitle>
              <Link to="/admin-dashboard">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>Review and approve tutor KYC documents</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kycLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading KYC documents...</TableCell>
                  </TableRow>
                ) : kycDocuments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No KYC documents awaiting approval.</TableCell>
                  </TableRow>
                ) : (
                  kycDocuments?.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.user_id}</TableCell>
                      <TableCell>{doc.document_type}</TableCell>
                      <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleApproveKyc(doc.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRejectKyc(doc.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
