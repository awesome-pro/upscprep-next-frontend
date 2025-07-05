export enum UserRole {
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
    ADMIN = 'ADMIN'
}

export enum ExamType {
    PRELIMS = 'PRELIMS',
    MAINS = 'MAINS',
    MOCK_TEST = 'MOCK_TEST'
}

export enum TestType {
    SECTIONAL = 'SECTIONAL',
    MULTI_SECTIONAL = 'MULTI_SECTIONAL',
    FULL_LENGTH = 'FULL_LENGTH',
    CHAPTER_TEST = 'CHAPTER_TEST',
    MOCK_TEST = 'MOCK_TEST'
}

export enum AttemptStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    EVALUATION_PENDING = 'EVALUATION_PENDING',
    EVALUATED = 'EVALUATED',
    FAILED = 'FAILED',
    COMPLETED = 'COMPLETED',
    SUBMITTED = 'SUBMITTED',
    ABANDONED = 'ABANDONED'
}

export enum ExamStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
}

export enum PurchaseType {
    COURSE = 'COURSE',
    TEST_SERIES = 'TEST_SERIES',
    INDIVIDUAL_EXAM = 'INDIVIDUAL_EXAM'
}

export enum PurchaseStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED'
}

export enum CourseType {
    PRELIMS = 'PRELIMS',
    MAINS = 'MAINS',
    PRELIMS_MAINS_COMBO = 'PRELIMS_MAINS_COMBO'
}

export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc'
}

export enum AccessType {
    TEST_SERIES = 'TEST_SERIES',
    COURSE = 'COURSE',
    INDIVIDUAL = 'INDIVIDUAL'
}