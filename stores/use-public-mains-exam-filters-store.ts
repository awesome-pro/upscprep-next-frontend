import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ExamStatus, ExamType, TestType } from '@/types'
interface State {
    search: string;
    status: ExamStatus | null;
    type: ExamType | null;
    testType: TestType | null;
    setSearch: (search: string) => void;
    setStatus: (status: ExamStatus | null) => void;
    setType: (type: ExamType | null) => void;
    setTestType: (testType: TestType | null) => void;
    resetFilters: () => void;
}

export const usePublicMainsExamFiltersStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                search: '',
                status: null,
                type: null,
                testType: null,

                setSearch: (search) => set({ search }),
                setStatus: (status) => set({ status }),
                setType: (type) => set({ type }),
                setTestType: (testType) => set({ testType }),

                resetFilters: () => set({
                    search: '',
                    status: null,
                    type: null,
                    testType: null
                })
            }),
            { name: 'exam-filters' }
        )
    )
);