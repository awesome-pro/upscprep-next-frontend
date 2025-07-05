"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import { toast } from "sonner";
import { CourseEnrollment, EnrollmentWithCourse } from "@/types/enrollment";
import enrollmentApi from "@/services/enrollment.api";
import { useAuth } from "./use-auth";
import { LoaderIcon } from "lucide-react";

interface CourseEnrollmentsState {
  enrollments: EnrollmentWithCourse[];
  enrollmentIds: string[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

type CourseEnrollmentsAction =
  | { type: "INITIALIZE"; payload: CourseEnrollmentsState }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ENROLLMENTS"; payload: EnrollmentWithCourse[] }
  | { type: "SET_ENROLLMENT_IDS"; payload: string[] }
  | { type: "ADD_ENROLLMENT"; payload: EnrollmentWithCourse }
  | { type: "UPDATE_ENROLLMENT"; payload: { id: string; data: Partial<CourseEnrollment> } }
  | { type: "REMOVE_ENROLLMENT"; payload: string };

interface CourseEnrollmentsContextType extends CourseEnrollmentsState {
  fetchEnrollments: () => Promise<void>;
  fetchEnrollmentIds: () => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  getEnrollmentById: (enrollmentId: string) => EnrollmentWithCourse | undefined;
  getEnrollmentByCourseId: (courseId: string) => EnrollmentWithCourse | undefined;
}

const initialState: CourseEnrollmentsState = {
  enrollments: [],
  enrollmentIds: [],
  isLoading: false,
  isInitialized: false,
  error: null,
};

const courseEnrollmentsReducer = (
  state: CourseEnrollmentsState,
  action: CourseEnrollmentsAction
): CourseEnrollmentsState => {
  switch (action.type) {
    case "INITIALIZE":
      return { ...action.payload, isInitialized: true };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ENROLLMENTS":
      return { ...state, enrollments: action.payload };
    case "SET_ENROLLMENT_IDS":
      return { ...state, enrollmentIds: action.payload };
    case "ADD_ENROLLMENT":
      return {
        ...state,
        enrollments: [...state.enrollments, action.payload],
        enrollmentIds: [...state.enrollmentIds, action.payload.id],
      };
    case "UPDATE_ENROLLMENT":
      return {
        ...state,
        enrollments: state.enrollments.map((enrollment) =>
          enrollment.id === action.payload.id
            ? { ...enrollment, ...action.payload.data }
            : enrollment
        ),
      };
    case "REMOVE_ENROLLMENT":
      return {
        ...state,
        enrollments: state.enrollments.filter(
          (enrollment) => enrollment.id !== action.payload
        ),
        enrollmentIds: state.enrollmentIds.filter((id) => id !== action.payload),
      };
    default:
      return state;
  }
};

// Context & Provider
const CourseEnrollmentsContext = createContext<CourseEnrollmentsContextType | undefined>(
  undefined
);

export function CourseEnrollmentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(courseEnrollmentsReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  const fetchEnrollments = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data } = await enrollmentApi.getUserEnrollments();
      dispatch({ type: "SET_ENROLLMENTS", payload: data });
    } catch (error: any) {
      console.error("Error fetching enrollments:", error);
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to fetch enrollments" });
      toast.error("Failed to load your course enrollments");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, user]);

  const fetchEnrollmentIds = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data } = await enrollmentApi.getUserEnrollmentIds();
      dispatch({ type: "SET_ENROLLMENT_IDS", payload: data });
    } catch (error: any) {
      console.error("Error fetching enrollment IDs:", error);
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to fetch enrollment IDs" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, user]);

  const isEnrolled = useCallback(
    (courseId: string) => {
      return state.enrollments.some((enrollment) => enrollment.courseId === courseId);
    },
    [state.enrollments]
  );

  const getEnrollmentById = useCallback(
    (enrollmentId: string) => {
      return state.enrollments.find((enrollment) => enrollment.id === enrollmentId);
    },
    [state.enrollments]
  );

  const getEnrollmentByCourseId = useCallback(
    (courseId: string) => {
      return state.enrollments.find((enrollment) => enrollment.courseId === courseId);
    },
    [state.enrollments]
  );

  useEffect(() => {
    if (isAuthenticated && !state.isInitialized) {
      const initializeEnrollments = async () => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          
          // Fetch both enrollments and enrollment IDs in parallel
          const [enrollmentsResponse, enrollmentIdsResponse] = await Promise.all([
            enrollmentApi.getUserEnrollments(),
            enrollmentApi.getUserEnrollmentIds()
          ]);
          
          dispatch({
            type: "INITIALIZE",
            payload: {
              ...initialState,
              enrollments: enrollmentsResponse.data,
              enrollmentIds: enrollmentIdsResponse.data,
              isLoading: false,
            },
          });
        } catch (error: any) {
          console.error("Error initializing enrollments:", error);
          dispatch({
            type: "INITIALIZE",
            payload: {
              ...initialState,
              error: error.message || "Failed to initialize enrollments",
              isLoading: false,
            },
          });
          toast.error("Failed to load your course enrollments");
        }
      };

      initializeEnrollments();
    }
  }, [isAuthenticated, state.isInitialized]);

  const value = useMemo(
    () => ({
      ...state,
      fetchEnrollments,
      fetchEnrollmentIds,
      isEnrolled,
      getEnrollmentById,
      getEnrollmentByCourseId,
    }),
    [
      state,
      fetchEnrollments,
      fetchEnrollmentIds,
      isEnrolled,
      getEnrollmentById,
      getEnrollmentByCourseId,
    ]
  );

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  if (!state.isInitialized && state.isLoading) {
    return (
      <section className="flex items-center justify-center h-full w-full">
        <LoaderIcon className="w-4 h-4 animate-spin" />
      </section>
    );
  }

  return (
    <CourseEnrollmentsContext.Provider value={value}>
      {children}
    </CourseEnrollmentsContext.Provider>
  );
}

export function useCourseEnrollments() {
  const context = useContext(CourseEnrollmentsContext);
  if (!context) {
    throw new Error(
      "useCourseEnrollments must be used within a CourseEnrollmentsProvider"
    );
  }
  return context;
}
