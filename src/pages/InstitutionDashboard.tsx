
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Users, 
  BookOpen, 
  DollarSign, 
  Video, 
  Plus,
  TrendingUp,
  Award,
  FileText,
  Upload,
  Eye
} from "lucide-react";

const InstitutionDashboard = () => {
  // Mock data - replace with real Supabase queries
  const institutionStats = {
    totalStudents: 1250,
    activeCourses: 15,
    totalRevenue: 125000,
    completionRate: 87
  };

  const recentCourses = [
    {
      id: "1",
      title: "Digital Marketing Certificate",
      students: 45,
      progress: 78,
      revenue: 15000
    },
    {
      id: "2", 
      title: "Data Analytics Bootcamp",
      students: 32,
      progress: 65,
      revenue: 22000
    }
  ];

  const pendingEnrollments = [
    {
      id: "1",
      course: "Web Development Certificate",
      students: 12,
      status: "pending_payment"
    }
  ];

  return (
    <ProtectedRoute requiredRole="institution">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Institution Dashboard</h1>
            <p className="text-muted-foreground">Manage your certificate courses and student enrollments</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{institutionStats.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{institutionStats.activeCourses}</div>
                <p className="text-xs text-muted-foreground">3 new this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${institutionStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+22% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{institutionStats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="courses">Course Management</TabsTrigger>
              <TabsTrigger value="enrollments">Group Enrollments</TabsTrigger>
              <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Certificate Courses</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
              </div>
              
              <div className="grid gap-4">
                {recentCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {course.students} enrolled students
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="outline">{course.progress}% Complete</Badge>
                          <p className="text-sm font-medium">${course.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Group Enrollments</h2>
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Group Session
                </Button>
              </div>
              
              <div className="grid gap-4">
                {pendingEnrollments.map((enrollment) => (
                  <Card key={enrollment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{enrollment.course}</h3>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.students} students waiting
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={enrollment.status === 'pending_payment' ? 'destructive' : 'default'}
                          >
                            {enrollment.status.replace('_', ' ')}
                          </Badge>
                          <Button size="sm">Process</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="accreditation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Accreditation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">Institution License</h3>
                          <p className="text-sm text-muted-foreground">Required for certificate issuance</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Pending Review</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Additional Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <p className="text-sm text-muted-foreground">Payment Success Rate</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">$1,250</div>
                      <p className="text-sm text-muted-foreground">Avg. Course Revenue</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">78%</div>
                      <p className="text-sm text-muted-foreground">Certificate Completion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InstitutionDashboard;
