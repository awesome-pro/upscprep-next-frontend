export enum EntityType {
  COURSE = 'COURSE',
  MODULE = 'MODULE',
  LESSON = 'LESSON',
  EXAM = 'EXAM',
  ATTEMPT = 'ATTEMPT',
  TEST_SERIES = 'TEST_SERIES',
}

export interface UserProgress {
  id: string;
  userId: string;
  entityId: string;
  entityType: EntityType;
  accuracy?: number;
  score?: number;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number;
  lastPosition: number;
  lastAccessedAt: string;
  visitCount: number;
  metadata: Record<string, any>;
  weeklyProgress: Record<string, {
    timeSpent: number;
    visits: number;
    completed: boolean;
  }>;
  monthlyProgress: Record<string, {
    timeSpent: number;
    visits: number;
    completed: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface StudentStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivity: string;
  totalDays: number;
  studyMinutes: number;
  testsAttempted: number;
  lessonsCompleted: number;
  questionsAnswered: number;
  pointsEarned: number;
  dailyActivities: Record<string, {
    studyMinutes: number;
    testsAttempted: number;
    lessonsCompleted: number;
    questionsAnswered: number;
    pointsEarned: number;
  }>;
  weeklyStats: Record<string, {
    studyMinutes: number;
    testsAttempted: number;
    lessonsCompleted: number;
    questionsAnswered: number;
    pointsEarned: number;
    activeDays: number;
    activeDates?: Record<string, boolean>;
  }>;
  monthlyStats: Record<string, {
    studyMinutes: number;
    testsAttempted: number;
    lessonsCompleted: number;
    questionsAnswered: number;
    pointsEarned: number;
    activeDays: number;
    activeDates?: Record<string, boolean>;
  }>;
}

export interface ProgressSummary {
  totalEntities: number;
  totalCompleted: number;
  totalTimeSpentSeconds: number;
  byEntityType: Record<EntityType, {
    total: number;
    completed: number;
    timeSpentSeconds: number;
  }>;
}
