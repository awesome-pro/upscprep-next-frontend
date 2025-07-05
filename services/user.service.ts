import api from '@/lib/axios';
import { PaginatedResult } from '@/lib/pagination';
import {
  CreateStudentDto,
  CreateTeacherDto,
  CreateUserDto,
  StudentDetail,
  TeacherContent,
  TeacherDetail,
  TeacherStudentsQueryParams,
  UpdateStudentDto,
  UpdateTeacherDto,
  UpdateUserDto,
  UserList,
  UserQueryParams,
  UserStatistics
} from '@/types/user';

// Base URLs for different user types
const STUDENTS_URL = '/students';
const TEACHERS_URL = '/teachers';
const ADMIN_USERS_URL = '/admin/users';

export const userService = {
  // Student services
  async getStudentProfile(): Promise<StudentDetail> {
    return (await api.get(`${STUDENTS_URL}/profile`)).data;
  },

  async getStudentEnrollments(studentId?: string): Promise<any> {
    const url = studentId ? `${STUDENTS_URL}/${studentId}/enrollments` : `${STUDENTS_URL}/enrollments`;
    return (await api.get(url)).data;
  },

  async getStudentProgress(studentId?: string): Promise<any> {
    const url = studentId ? `${STUDENTS_URL}/${studentId}/progress` : `${STUDENTS_URL}/progress`;
    return (await api.get(url)).data;
  },

  async updateStudentProfile(data: UpdateStudentDto): Promise<StudentDetail> {
    return (await api.patch(`${STUDENTS_URL}/profile`, data)).data;
  },

  async getAllStudents(params: UserQueryParams = {}): Promise<PaginatedResult<UserList>> {
    return (await api.get(STUDENTS_URL, { params })).data;
  },

  async getStudentById(id: string): Promise<StudentDetail> {
    return (await api.get(`${STUDENTS_URL}/${id}`)).data;
  },

  async createStudent(data: CreateStudentDto): Promise<StudentDetail> {
    return (await api.post(STUDENTS_URL, data)).data;
  },

  async updateStudent(id: string, data: UpdateStudentDto): Promise<StudentDetail> {
    return (await api.patch(`${STUDENTS_URL}/${id}`, data)).data;
  },

  // Teacher services
  async getTeacherProfile(): Promise<TeacherDetail> {
    return (await api.get(`${TEACHERS_URL}/profile`)).data;
  },

  async getTeacherContent(teacherId?: string): Promise<TeacherContent> {
    const url = teacherId ? `${TEACHERS_URL}/${teacherId}/content` : `${TEACHERS_URL}/content`;
    return (await api.get(url)).data;
  },

  async getTeacherStudents(
    params: TeacherStudentsQueryParams = {},
    teacherId?: string
  ): Promise<PaginatedResult<UserList>> {
    const url = teacherId ? `${TEACHERS_URL}/${teacherId}/students` : `${TEACHERS_URL}/students`;
    return (await api.get(url, { params })).data;
  },

  async updateTeacherProfile(data: UpdateTeacherDto): Promise<TeacherDetail> {
    return (await api.patch(`${TEACHERS_URL}/profile`, data)).data;
  },

  async getAllTeachers(params: UserQueryParams = {}): Promise<PaginatedResult<UserList>> {
    return (await api.get(TEACHERS_URL, { params })).data;
  },

  async getTeacherById(id: string): Promise<TeacherDetail> {
    return (await api.get(`${TEACHERS_URL}/${id}`)).data;
  },

  async createTeacher(data: CreateTeacherDto): Promise<TeacherDetail> {
    return (await api.post(TEACHERS_URL, data)).data;
  },

  async updateTeacher(id: string, data: UpdateTeacherDto): Promise<TeacherDetail> {
    return (await api.patch(`${TEACHERS_URL}/${id}`, data)).data;
  },

  // Admin user services
  async getAllUsers(params: UserQueryParams = {}): Promise<PaginatedResult<UserList>> {
    return (await api.get(ADMIN_USERS_URL, { params })).data;
  },

  async getUserStatistics(): Promise<UserStatistics> {
    return (await api.get(`${ADMIN_USERS_URL}/statistics`)).data;
  },

  async getUserById(id: string): Promise<UserList> {
    return (await api.get(`${ADMIN_USERS_URL}/${id}`)).data;
  },

  async createUser(data: CreateUserDto): Promise<UserList> {
    return (await api.post(ADMIN_USERS_URL, data)).data;
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<UserList> {
    return (await api.patch(`${ADMIN_USERS_URL}/${id}`, data)).data;
  },

  async resetUserPassword(id: string, password: string): Promise<{ message: string }> {
    return (await api.patch(`${ADMIN_USERS_URL}/${id}/reset-password`, { password })).data;
  },

  // Common methods for all user types
  async deleteUser(id: string): Promise<{ message: string }> {
    return (await api.delete(`${ADMIN_USERS_URL}/${id}`)).data;
  },

  async bulkDeleteUsers(userIds: string[]): Promise<{ message: string }> {
    return (await api.delete(`${ADMIN_USERS_URL}/bulk`, { data: { userIds } })).data;
  }
};

export default userService;
