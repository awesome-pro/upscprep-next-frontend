export interface Syllabus {
  id: string;
  title: string;
  content: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateSyllabusDto {
  title: string;
  content: string;
}

export interface UpdateSyllabusDto {
  title?: string;
  content?: string;
}

export interface QuerySyllabusDto {
  title?: string;
  page?: number;
  pageSize?: number;
}