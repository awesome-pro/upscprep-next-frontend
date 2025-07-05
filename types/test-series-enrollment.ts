export interface TestSeriesEnrollment {
  id: string;
  userId: string;
  testSeriesId: string;
  purchaseId: string;
  
  // Access control
  startDate: string;
  endDate: string;
  isActive: boolean;
  
  // Progress tracking
  progressPercentage: number;
  completedTests: number;
  totalTests: number;
  averageScore: number | null;
  lastAccessedAt: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface TestSeriesEnrollmentWithTestSeries extends TestSeriesEnrollment {
  testSeries: {
    id: string;
    title: string;
    description: string;
    subject: string;
    totalTests: number;
    difficulty: string;
  };
}

export interface TestSeriesEnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedTests: number;
  averageScore: number | null;
}

export interface UpdateTestSeriesEnrollmentDto {
  progressPercentage?: number;
  completedTests?: number;
  averageScore?: number | null;
  isActive?: boolean;
  lastAccessedAt?: string;
}
