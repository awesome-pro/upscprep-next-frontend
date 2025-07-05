'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersIcon, BookOpenIcon, ClipboardCheckIcon, BarChart3Icon, BellIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import api from '@/lib/axios';

export function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [courseStats, setCourseStats] = useState<any>(null);
  const [testSeriesStats, setTestSeriesStats] = useState<any>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Fetch user statistics
        const userStatsResponse = await api.get('/admin/users/statistics');
        setUserStats(userStatsResponse.data);

        // Fetch recent users
        const recentUsersResponse = await api.get('/admin/users?pageSize=5&sortBy=enrollmentDate&sortOrder=desc');
        setRecentUsers(recentUsersResponse.data.items || []);

        // Fetch course statistics
        const courseStatsResponse = await api.get('/admin/courses/statistics');
        setCourseStats(courseStatsResponse.data);

        // Fetch test series statistics
        const testSeriesStatsResponse = await api.get('/admin/test-series/statistics');
        setTestSeriesStats(testSeriesStatsResponse.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchAdminData();
    }
  }, [user?.id]);

  return (
    <section className="space-y-8">
      {/* Platform Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {userStats?.totalUsers || 0}
                </div>
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {userStats?.byRole?.STUDENT || 0}
                </div>
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {courseStats?.totalCourses || 0}
                </div>
                <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Test Series</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {testSeriesStats?.totalTestSeries || 0}
                </div>
                <ClipboardCheckIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="users">
            <UsersIcon className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="content">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3Icon className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">User Overview</CardTitle>
              <CardDescription>Distribution of users by role and status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Users by Role</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Students</Badge>
                          <span>{userStats?.byRole?.STUDENT || 0}</span>
                        </div>
                        <Progress 
                          value={userStats?.totalUsers ? (userStats?.byRole?.STUDENT / userStats?.totalUsers) * 100 : 0} 
                          className="w-1/2" 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Teachers</Badge>
                          <span>{userStats?.byRole?.TEACHER || 0}</span>
                        </div>
                        <Progress 
                          value={userStats?.totalUsers ? (userStats?.byRole?.TEACHER / userStats?.totalUsers) * 100 : 0} 
                          className="w-1/2" 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Admins</Badge>
                          <span>{userStats?.byRole?.ADMIN || 0}</span>
                        </div>
                        <Progress 
                          value={userStats?.totalUsers ? (userStats?.byRole?.ADMIN / userStats?.totalUsers) * 100 : 0} 
                          className="w-1/2" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent User Registrations</h3>
                    <div className="space-y-2">
                      {recentUsers.length > 0 ? (
                        recentUsers.map((user) => (
                          <div key={user.id} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge>{user.role}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(user.enrollmentDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-2">No recent users</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Content Overview</CardTitle>
              <CardDescription>Statistics about courses and test series</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Course Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Courses</p>
                        <p className="text-2xl font-bold">{courseStats?.totalCourses || 0}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Active Courses</p>
                        <p className="text-2xl font-bold">{courseStats?.activeCourses || 0}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Enrollments</p>
                        <p className="text-2xl font-bold">{courseStats?.totalEnrollments || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Test Series Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Test Series</p>
                        <p className="text-2xl font-bold">{testSeriesStats?.totalTestSeries || 0}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Active Test Series</p>
                        <p className="text-2xl font-bold">{testSeriesStats?.activeTestSeries || 0}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Enrollments</p>
                        <p className="text-2xl font-bold">{testSeriesStats?.totalEnrollments || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Platform Analytics</CardTitle>
              <CardDescription>Key performance metrics for the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">User Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">New Users (Last 30 Days)</p>
                        <p className="text-2xl font-bold">{userStats?.newUsersLast30Days || 0}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Active Users (Last 30 Days)</p>
                        <p className="text-2xl font-bold">{userStats?.activeUsersLast30Days || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Content Engagement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Course Completion Rate</p>
                        <p className="text-2xl font-bold">
                          {courseStats?.completionRate ? `${courseStats.completionRate}%` : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Exam Attempts</p>
                        <p className="text-2xl font-bold">{testSeriesStats?.totalAttempts || 0}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg. Score</p>
                        <p className="text-2xl font-bold">
                          {testSeriesStats?.averageScore ? `${testSeriesStats.averageScore}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
