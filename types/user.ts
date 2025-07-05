import { UserRole } from "./enums";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  VERIFICATION_PENDING = "VERIFICATION_PENDING",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  enrollmentDate?: string;
  walletBalance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserList extends User {
  _count?: {
    courseEnrollments?: number;
    testSeriesEnrollments?: number;
    attempts?: number;
    createdCourses?: number;
    createdExams?: number;
    createdTestSeries?: number;
  };
}

export interface StudentDetail extends User {
  courseEnrollments?: {
    courseId: string;
    startDate: string;
    endDate: string;
    course: {
      title: string;
    };
  }[];
  testSeriesEnrollments?: {
    testSeriesId: string;
    startDate: string;
    endDate: string;
    testSeries: {
      title: string;
    };
  }[];
  progress?: {
    completedLessons: number;
    totalLessons: number;
    completionPercentage: number;
  };
}

export interface TeacherDetail extends User {
  _count?: {
    createdCourses: number;
    createdExams: number;
    createdTestSeries: number;
  };
}

export interface TeacherContent {
  courses: {
    id: string;
    title: string;
    type: string;
    subject: string;
    isActive: boolean;
    totalStudents: number;
    _count: {
      modules: number;
      enrollments: number;
    };
  }[];
  testSeries: {
    id: string;
    title: string;
    type: string;
    isActive: boolean;
    _count: {
      exams: number;
      enrollments: number;
    };
  }[];
  exams: {
    id: string;
    title: string;
    type: string;
    testType: string;
    isActive: boolean;
    _count: {
      questions: number;
      attempts: number;
    };
  }[];
}

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TeacherStudentsQueryParams {
  page?: number;
  pageSize?: number;
  courseId?: string;
  testSeriesId?: string;
}

export interface CreateStudentDto {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  status?: UserStatus;
}

export interface CreateTeacherDto {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  specialization?: string;
}

export interface UpdateTeacherDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  specialization?: string;
  status?: UserStatus;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserStatistics {
  totalUsers: number;
  byRole: Record<UserRole, number>;
  byStatus: Record<UserStatus, number>;
  newUsersLast30Days: number;
  activeUsersLast30Days: number;
}
