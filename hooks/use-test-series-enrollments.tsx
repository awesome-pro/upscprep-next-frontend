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
import { 
  TestSeriesEnrollment, 
  TestSeriesEnrollmentWithTestSeries 
} from "@/types/test-series-enrollment";
import testSeriesEnrollmentApi from "@/services/test-series-enrollment.api";
import { useAuth } from "./use-auth";
import { LoaderIcon } from "lucide-react";

interface TestSeriesEnrollmentsState {
  enrollments: TestSeriesEnrollmentWithTestSeries[];
  enrollmentIds: string[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

type TestSeriesEnrollmentsAction =
  | { type: "INITIALIZE"; payload: TestSeriesEnrollmentsState }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ENROLLMENTS"; payload: TestSeriesEnrollmentWithTestSeries[] }
  | { type: "SET_ENROLLMENT_IDS"; payload: string[] }
  | { type: "ADD_ENROLLMENT"; payload: TestSeriesEnrollmentWithTestSeries }
  | { type: "UPDATE_ENROLLMENT"; payload: { id: string; data: Partial<TestSeriesEnrollment> } }
  | { type: "REMOVE_ENROLLMENT"; payload: string };

interface TestSeriesEnrollmentsContextType extends TestSeriesEnrollmentsState {
  fetchEnrollments: () => Promise<void>;
  fetchEnrollmentIds: () => Promise<void>;
  isEnrolled: (testSeriesId: string) => boolean;
  getEnrollmentById: (enrollmentId: string) => TestSeriesEnrollmentWithTestSeries | undefined;
  getEnrollmentByTestSeriesId: (testSeriesId: string) => TestSeriesEnrollmentWithTestSeries | undefined;
  updateEnrollment: (id: string, data: Partial<TestSeriesEnrollment>) => Promise<void>;
}

const initialState: TestSeriesEnrollmentsState = {
  enrollments: [],
  enrollmentIds: [],
  isLoading: false,
  isInitialized: false,
  error: null,
};

const testSeriesEnrollmentsReducer = (
  state: TestSeriesEnrollmentsState,
  action: TestSeriesEnrollmentsAction
): TestSeriesEnrollmentsState => {
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
const TestSeriesEnrollmentsContext = createContext<TestSeriesEnrollmentsContextType | undefined>(
  undefined
);

export function TestSeriesEnrollmentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(testSeriesEnrollmentsReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  const fetchEnrollments = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data } = await testSeriesEnrollmentApi.getUserEnrollments();
      dispatch({ type: "SET_ENROLLMENTS", payload: data });
    } catch (error: any) {
      console.error("Error fetching test series enrollments:", error);
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to fetch test series enrollments" });
      toast.error("Failed to load your test series enrollments");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, user]);

  const fetchEnrollmentIds = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { data } = await testSeriesEnrollmentApi.getUserEnrollmentIds();
      dispatch({ type: "SET_ENROLLMENT_IDS", payload: data });
    } catch (error: any) {
      console.error("Error fetching test series enrollment IDs:", error);
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to fetch test series enrollment IDs" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, user]);

  const updateEnrollment = useCallback(async (id: string, data: Partial<TestSeriesEnrollment>) => {
    if (!isAuthenticated || !user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await testSeriesEnrollmentApi.updateEnrollment(id, data);
      dispatch({ 
        type: "UPDATE_ENROLLMENT", 
        payload: { id, data: response.data } 
      });
    } catch (error: any) {
      console.error("Error updating test series enrollment:", error);
      dispatch({ type: "SET_ERROR", payload: error.message || "Failed to update test series enrollment" });
      toast.error("Failed to update test series enrollment");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, user]);

  const isEnrolled = useCallback(
    (testSeriesId: string) => {
      return state.enrollments.some((enrollment) => enrollment.testSeriesId === testSeriesId);
    },
    [state.enrollments]
  );

  const getEnrollmentById = useCallback(
    (enrollmentId: string) => {
      return state.enrollments.find((enrollment) => enrollment.id === enrollmentId);
    },
    [state.enrollments]
  );

  const getEnrollmentByTestSeriesId = useCallback(
    (testSeriesId: string) => {
      return state.enrollments.find((enrollment) => enrollment.testSeriesId === testSeriesId);
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
            testSeriesEnrollmentApi.getUserEnrollments(),
            testSeriesEnrollmentApi.getUserEnrollmentIds()
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
          console.error("Error initializing test series enrollments:", error);
          dispatch({
            type: "INITIALIZE",
            payload: {
              ...initialState,
              error: error.message || "Failed to initialize test series enrollments",
              isLoading: false,
            },
          });
          toast.error("Failed to load your test series enrollments");
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
      getEnrollmentByTestSeriesId,
      updateEnrollment,
    }),
    [
      state,
      fetchEnrollments,
      fetchEnrollmentIds,
      isEnrolled,
      getEnrollmentById,
      getEnrollmentByTestSeriesId,
      updateEnrollment,
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
    <TestSeriesEnrollmentsContext.Provider value={value}>
      {children}
    </TestSeriesEnrollmentsContext.Provider>
  );
}

export function useTestSeriesEnrollments() {
  const context = useContext(TestSeriesEnrollmentsContext);
  if (!context) {
    throw new Error(
      "useTestSeriesEnrollments must be used within a TestSeriesEnrollmentsProvider"
    );
  }
  return context;
}
