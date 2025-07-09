
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, DollarSign, TrendingUp, Settings, Eye, UserCheck, AlertTriangle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

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

  const totalUsers = allProfiles?.length || 0;
  const totalTutors = allProfiles?.filter(p => p.role === 'tutor').length || 0;
  const totalStudents = allProfiles?.filter(p => p.role === 'student').length || 0;
  const pendingKyc = allProfiles?.filter(p => p.kyc_status === 'pending').length || 0;

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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
              <p className="text-xs text-gray-500">Active platform users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Tutors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalTutors}</div>
              <p className="text-xs text-gray-500">Verified educators</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalStudents}</div>
              <p className="text-xs text-gray-500">Learning on platform</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending KYC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingKyc}</div>
              <p className="text-xs text-gray-500">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent User Registrations
                </CardTitle>
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

            {/* Platform Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Platform Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.slice(0, 5).map((metric) => (
                    <div key={metric.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{metric.metric_name}</span>
                      <span className="text-blue-600 font-bold">{metric.metric_value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve KYC Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Monitor Live Sessions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-semibold text-green-600">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">System Uptime</span>
                  <span className="font-semibold text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Usage</span>
                  <span className="font-semibold text-blue-600">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Response Time</span>
                  <span className="font-semibold text-green-600">120ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
