// export interface PrelimsExam {
//     id: string
//     title: string
//     createdAt: Date
//     duration: number
//     totalQuestions: number
//     timeLimit: number
//     averageScore: number
// }

export type PrelimsExamSubmission = {
    student: {
        email: string
        name: string
        avatar: string
    }
    submittedAt: Date
    completedIn: number
    score: number
}
