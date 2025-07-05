"use client";

import React, { useEffect, useState } from 'react'
import { ProgressDashboard } from '@/components/progress/progress-dashboard'
import { StreakDisplay } from '@/components/progress/streak-display'
import { useProgress } from '@/hooks/useProgress'
import { EntityType } from '@/types/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpenIcon, ClipboardCheckIcon, BarChart3Icon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { UserRole } from '@/types'
import { TeacherDashboard, AdminDashboard } from '@/components/dashboard'

export default function DashboardPage() {
  const { user } = useAuth();
  const { getProgressSummary, getAllProgressByType, loading: progressLoading } = useProgress();
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [courseProgress, setCourseProgress] = useState<any[]>([]);
  const [examProgress, setExamProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch overall progress summary
        const summary = await getProgressSummary();
        setProgressSummary(summary);
        
        // Fetch course progress
        const courses = await getAllProgressByType(EntityType.COURSE);
        setCourseProgress(courses);
        
        // Fetch exam progress
        const exams = await getAllProgressByType(EntityType.EXAM);
        setExamProgress(exams);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format time spent in hours and minutes
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Render different dashboards based on user role
  if (!user) {
    return (
      <section className="p-4 lg:p-10 flex items-center justify-center h-[50vh]">
        <Skeleton className="h-32 w-full" />
      </section>
    );
  }

  // Render admin dashboard
  if (user.role === UserRole.ADMIN) {
    return (
      <section className="p-4 lg:p-10">
        <AdminDashboard />
      </section>
    );
  }

  // Render teacher dashboard
  if (user.role === UserRole.TEACHER) {
    return (
      <section className="p-4 lg:p-10">
        <TeacherDashboard />
      </section>
    );
  }

  // Render student dashboard (default)
  return (
    <section className="space-y-8 p-4 lg:p-10">
      <ProgressDashboard />
      <StreakDisplay />
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="courses">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="exams">
            <ClipboardCheckIcon className="h-4 w-4 mr-2" />
            Exams
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart3Icon className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Course Activity</CardTitle>
              <CardDescription>Your recently accessed courses and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : courseProgress.length > 0 ? (
                <div className="space-y-4">
                  {courseProgress.slice(0, 5).map((course) => (
                    <div key={course.entityId} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{course.entityName || 'Course'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTimeSpent(course.timeSpent)} spent • 
                          {course.isCompleted ? 'Completed' : 'In progress'}
                        </p>
                      </div>
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${course.isCompleted ? 100 : Math.min(Math.max((course.timeSpent / 3600) * 20, 10), 90)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No course activity recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Exam Activity</CardTitle>
              <CardDescription>Your recently accessed exams and scores</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : examProgress.length > 0 ? (
                <div className="space-y-4">
                  {examProgress.slice(0, 5).map((exam) => (
                    <div key={exam.entityId} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{exam.entityName || 'Exam'}</p>
                        <p className="text-sm text-muted-foreground">
                          {exam.score ? `Score: ${exam.score}%` : 'Not attempted'} • 
                          {exam.accuracy ? `Accuracy: ${exam.accuracy}%` : ''}
                        </p>
                      </div>
                      {exam.score && (
                        <div className="text-sm font-medium">
                          {exam.score >= 70 ? '🏆' : exam.score >= 50 ? '👍' : '🔄'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No exam activity recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Learning Insights</CardTitle>
              <CardDescription>Personalized insights based on your learning patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-32 w-full" />
              ) : progressSummary ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Time Spent</p>
                      <p className="text-2xl font-bold">{formatTimeSpent(progressSummary.totalTimeSpentSeconds)}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {progressSummary.totalEntities > 0 
                          ? Math.round((progressSummary.totalCompleted / progressSummary.totalEntities) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Learning Items</p>
                      <p className="text-2xl font-bold">{progressSummary.totalCompleted} / {progressSummary.totalEntities}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Personalized Recommendations</h3>
                    <ul className="space-y-2 text-sm">
                      {progressSummary.totalTimeSpentSeconds < 3600 && (
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Try to spend at least 1 hour studying to build a consistent learning habit.</span>
                        </li>
                      )}
                      {progressSummary.totalEntities > 0 && progressSummary.totalCompleted / progressSummary.totalEntities < 0.3 && (
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Complete more lessons to improve your knowledge retention.</span>
                        </li>
                      )}
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Review your completed lessons periodically to reinforce learning.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No insights available yet. Keep learning!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
