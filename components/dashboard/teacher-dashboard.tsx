'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenIcon, ClipboardCheckIcon, UsersIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import api from '@/lib/axios';

export function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teacherContent, setTeacherContent] = useState<any>(null);
  const [studentStats, setStudentStats] = useState<any>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        // Fetch teacher's content (courses, exams, test series)
        const contentResponse = await api.get(`/teachers/${user?.id}/content`);
        setTeacherContent(contentResponse.data);

        // Fetch student statistics for this teacher
        const studentsResponse = await api.get(`/teachers/${user?.id}/students?pageSize=5`);
        setStudentStats(studentsResponse.data);

      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTeacherData();
    }
  }, [user?.id]);

  return (
    <section className="space-y-8">
      {/* Teacher Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {teacherContent?.courses?.length || 0}
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
                  {teacherContent?.testSeries?.length || 0}
                </div>
                <ClipboardCheckIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {studentStats?.totalItems || 0}
                </div>
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="courses">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="test-series">
            <ClipboardCheckIcon className="h-4 w-4 mr-2" />
            Test Series
          </TabsTrigger>
          <TabsTrigger value="students">
            <UsersIcon className="h-4 w-4 mr-2" />
            Students
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Courses</CardTitle>
              <CardDescription>Courses you've created and their statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : teacherContent?.courses?.length > 0 ? (
                <div className="space-y-4">
                  {teacherContent.courses.map((course: any) => (
                    <div key={course.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{course.type}</Badge>
                          <Badge variant="outline">{course.subject}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {course._count.modules} modules
                          </span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{course.totalStudents} students</span>
                        </div>
                        <div className="mt-1">
                          {course.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No courses created yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test-series" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Test Series</CardTitle>
              <CardDescription>Test series you've created and their statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : teacherContent?.testSeries?.length > 0 ? (
                <div className="space-y-4">
                  {teacherContent.testSeries.map((series: any) => (
                    <div key={series.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{series.title}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{series.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {series._count.exams} exams
                          </span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{series._count.enrollments} enrollments</span>
                        </div>
                        <div className="mt-1">
                          {series.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No test series created yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Your Students</CardTitle>
              <CardDescription>Students enrolled in your courses and test series</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : studentStats?.items?.length > 0 ? (
                <div className="space-y-4">
                  {studentStats.items.map((student: any) => (
                    <div key={student.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{student.courseEnrollments?.length || 0} courses</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <ClipboardCheckIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{student.testSeriesEnrollments?.length || 0} test series</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No students enrolled yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
