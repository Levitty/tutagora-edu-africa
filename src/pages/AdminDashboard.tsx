import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Video, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  UserCheck,
  Building
} from "lucide-react";
import { useState } from "react";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with real Supabase queries
  const stats = {
    totalUsers: 1234,
    totalCourses: 89,
    totalEarnings: 45678,
    activeSessions: 23
  };

  const pendingVerifications = [
    {
      id: "1",
      name: "John Doe",
      type: "tutor",
      email: "john@example.com",
      status: "pending",
      submittedAt: "2024-01-15"
    },
    {
      id: "2", 
      name: "ABC Institution",
      type: "institution",
      email: "admin@abc.edu",
      status: "pending",
      submittedAt: "2024-01-14"
    }
  ];

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform operations and user verification</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSessions}</div>
                <p className="text-xs text-muted-foreground">Live sessions</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="verifications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="verifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>KYC & Accreditation Verifications</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <Input
                      placeholder="Search verifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingVerifications.map((verification) => (
                      <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {verification.type === 'institution' ? (
                            <Building className="h-10 w-10 text-blue-500" />
                          ) : (
                            <UserCheck className="h-10 w-10 text-green-500" />
                          )}
                          <div>
                            <h3 className="font-semibold">{verification.name}</h3>
                            <p className="text-sm text-muted-foreground">{verification.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {verification.submittedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {verification.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management features coming soon...</p>
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
    </ProtectedRoute>
  );
};

export default AdminDashboard;