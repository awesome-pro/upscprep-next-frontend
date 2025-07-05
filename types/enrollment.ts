export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  purchaseId: string;
  
  // Access control
  startDate: string;
  endDate: string;
  isActive: boolean;
  
  // Progress tracking
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  userId: string;
  
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number; // In seconds
  lastPosition: number; // For videos - last watched position in seconds
  
  // For quiz lessons
  quizScore?: number;
  quizAttempts: number;
  quizPassed: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentWithCourse extends CourseEnrollment {
  course: {
    id: string;
    title: string;
    description: string;
    type: string;
    subject: string;
    totalModules: number;
    totalLessons: number;
    totalDuration: number;
  };
}

export interface EnrollmentWithProgress extends CourseEnrollment {
  lessonProgress: LessonProgress[];
}

export interface UpdateLessonProgressDto {
  isCompleted?: boolean;
  timeSpent?: number;
  lastPosition?: number;
  quizScore?: number;
  quizPassed?: boolean;
}
