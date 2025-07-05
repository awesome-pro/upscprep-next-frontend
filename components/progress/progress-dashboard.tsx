'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { ProgressSummary } from '@/types/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, BookOpenIcon, TimerIcon, TrophyIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProgressDashboard() {
  const { getProgressSummary, loading: progressLoading } = useProgress();
  const { getStreak, loading: streakLoading } = useStreak();
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [progressData, streak] = await Promise.all([
        getProgressSummary(),
        getStreak(),
      ]);
      
      setProgressSummary(progressData);
      setStreakData(streak);
      setLoading(false);
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

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Get today's activity
  const getTodayActivity = () => {
    if (!streakData?.dailyActivities) return null;
    
    const today = getCurrentDate();
    return streakData.dailyActivities[today] || {
      studyMinutes: 0,
      testsAttempted: 0,
      lessonsCompleted: 0,
      questionsAnswered: 0,
      pointsEarned: 0,
    };
  };

  const todayActivity = getTodayActivity();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Your Learning Progress</h2>
      
      {/* Streak and Today's Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Current Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center">
                <div className="text-2xl font-bold">{streakData?.currentStreak || 0}</div>
                <span className="ml-2 text-xs text-muted-foreground">days</span>
                <div className="ml-auto text-xs text-muted-foreground">
                  Best: {streakData?.longestStreak || 0} days
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Study Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time Today</CardTitle>
            <TimerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center">
                <div className="text-2xl font-bold">{todayActivity?.studyMinutes || 0}</div>
                <span className="ml-2 text-xs text-muted-foreground">minutes</span>
                <div className="ml-auto text-xs text-muted-foreground">
                  Total: {formatTimeSpent(progressSummary?.totalTimeSpentSeconds || 0)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Lessons Completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center">
                <div className="text-2xl font-bold">{todayActivity?.lessonsCompleted || 0}</div>
                <span className="ml-2 text-xs text-muted-foreground">today</span>
                <div className="ml-auto text-xs text-muted-foreground">
                  Total: {progressSummary?.byEntityType?.LESSON?.completed || 0}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Points Earned */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center">
                <div className="text-2xl font-bold">{todayActivity?.pointsEarned || 0}</div>
                <span className="ml-2 text-xs text-muted-foreground">today</span>
                <div className="ml-auto text-xs text-muted-foreground">
                  Questions: {todayActivity?.questionsAnswered || 0}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>
            Your learning progress across different content types
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Courses Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Courses</div>
                  <div className="text-sm text-muted-foreground">
                    {progressSummary?.byEntityType?.COURSE?.completed || 0} / {progressSummary?.byEntityType?.COURSE?.total || 0}
                  </div>
                </div>
                <Progress 
                  value={progressSummary?.byEntityType?.COURSE?.total ? 
                    (progressSummary.byEntityType.COURSE.completed / progressSummary.byEntityType.COURSE.total) * 100 : 0} 
                />
              </div>
              
              {/* Modules Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Modules</div>
                  <div className="text-sm text-muted-foreground">
                    {progressSummary?.byEntityType?.MODULE?.completed || 0} / {progressSummary?.byEntityType?.MODULE?.total || 0}
                  </div>
                </div>
                <Progress 
                  value={progressSummary?.byEntityType?.MODULE?.total ? 
                    (progressSummary.byEntityType.MODULE.completed / progressSummary.byEntityType.MODULE.total) * 100 : 0} 
                />
              </div>
              
              {/* Lessons Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Lessons</div>
                  <div className="text-sm text-muted-foreground">
                    {progressSummary?.byEntityType?.LESSON?.completed || 0} / {progressSummary?.byEntityType?.LESSON?.total || 0}
                  </div>
                </div>
                <Progress 
                  value={progressSummary?.byEntityType?.LESSON?.total ? 
                    (progressSummary.byEntityType.LESSON.completed / progressSummary.byEntityType.LESSON.total) * 100 : 0} 
                />
              </div>
              
              {/* Exams Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Exams</div>
                  <div className="text-sm text-muted-foreground">
                    {progressSummary?.byEntityType?.EXAM?.completed || 0} / {progressSummary?.byEntityType?.EXAM?.total || 0}
                  </div>
                </div>
                <Progress 
                  value={progressSummary?.byEntityType?.EXAM?.total ? 
                    (progressSummary.byEntityType.EXAM.completed / progressSummary.byEntityType.EXAM.total) * 100 : 0} 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Activity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Breakdown</CardTitle>
          <CardDescription>
            Your learning activity over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="text-sm text-muted-foreground">
                  {Object.keys(streakData?.dailyActivities || {}).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(streakData?.dailyActivities || {}).slice(0, 7).map(([date, data]: [string, any]) => (
                        <div key={date} className="border-b pb-2">
                          <div className="font-medium">{new Date(date).toLocaleDateString()}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>Study time: {data.studyMinutes} minutes</div>
                            <div>Lessons: {data.lessonsCompleted}</div>
                            <div>Tests: {data.testsAttempted}</div>
                            <div>Questions: {data.questionsAnswered}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      No daily activity data available yet.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="weekly">
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="text-sm text-muted-foreground">
                  {Object.keys(streakData?.weeklyStats || {}).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(streakData?.weeklyStats || {}).map(([week, data]: [string, any]) => (
                        <div key={week} className="border-b pb-2">
                          <div className="font-medium">Week {week}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>Study time: {data.studyMinutes} minutes</div>
                            <div>Active days: {data.activeDays}</div>
                            <div>Lessons: {data.lessonsCompleted}</div>
                            <div>Tests: {data.testsAttempted}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      No weekly activity data available yet.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="monthly">
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="text-sm text-muted-foreground">
                  {Object.keys(streakData?.monthlyStats || {}).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(streakData?.monthlyStats || {}).map(([month, data]: [string, any]) => (
                        <div key={month} className="border-b pb-2">
                          <div className="font-medium">{month}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>Study time: {data.studyMinutes} minutes</div>
                            <div>Active days: {data.activeDays}</div>
                            <div>Lessons: {data.lessonsCompleted}</div>
                            <div>Tests: {data.testsAttempted}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      No monthly activity data available yet.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
