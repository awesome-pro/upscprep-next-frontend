import { api } from "@/lib/axios";
import { TestSeriesListDto, TestSeriesDetailDto } from "@/types/test-series";
import { ExamType } from "@/types/enums";

// Test Series API
export const testSeriesApi = {
  // Get all test series with optional user context
  getAllTestSeries: async (): Promise<TestSeriesListDto[]> => {
    const response = await api.get('/test-series');
    return response.data;
  },

  // Get test series by type with optional user context
  getTestSeriesByType: async (type: ExamType): Promise<TestSeriesListDto[]> => {
    const response = await api.get(`/test-series?type=${type}`);
    return response.data;
  },

  // Get test series details by ID with optional user context
  getTestSeriesById: async (id: string): Promise<TestSeriesDetailDto> => {
    const response = await api.get(`/test-series/${id}`);
    return response.data;
  },

  // Check if user has access to a test series (requires authentication)
  checkTestSeriesAccess: async (id: string): Promise<boolean> => {
    const response = await api.get(`/test-series/${id}/access`);
    return response.data;
  }
};
