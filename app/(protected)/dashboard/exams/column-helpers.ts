import React from "react";
import { Exam, ExamType, TestType } from "@/types/exams";

// Filter options for exam types
export const examTypeOptions = [
  {
    value: ExamType.PRELIMS,
    label: "Prelims",
  },
  {
    value: ExamType.MAINS,
    label: "Mains",
  },
  {
    value: ExamType.MOCK_TEST,
    label: "Mock Test",
  },
];

// Filter options for test types
export const testTypeOptions = [
  { value: TestType.SECTIONAL, label: "Sectional" },
  { value: TestType.MULTI_SECTIONAL, label: "Multi Sectional" },
  { value: TestType.FULL_LENGTH, label: "Full Length" },
  { value: TestType.CHAPTER_TEST, label: "Chapter Test" },
  { value: TestType.MOCK_TEST, label: "Mock Test" },
];

// Filter options for pricing
export const pricingOptions = [
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

// Filter options for status
export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// Helper function to get badge variant based on exam type
export function getExamTypeBadgeVariant(type: ExamType) {
  switch (type) {
    case ExamType.PRELIMS:
      return "default";
    case ExamType.MAINS:
      return "secondary";
    case ExamType.MOCK_TEST:
      return "outline";
    default:
      return "outline";
  }
}

// Helper function to get badge variant based on test type
export function getTestTypeBadgeVariant(testType: TestType) {
  switch (testType) {
    case TestType.SECTIONAL:
      return "outline";
    case TestType.MULTI_SECTIONAL:
      return "secondary";
    case TestType.FULL_LENGTH:
      return "default";
    case TestType.CHAPTER_TEST:
      return "outline";
    case TestType.MOCK_TEST:
      return "outline";
    default:
      return "outline";
  }
}

// Helper function to format duration
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ""}`;
  }
  return `${remainingMinutes}m`;
}

// Helper function to format price
export function formatPrice(isFree: boolean, cost: number): string {
  if (isFree) {
    return "Free";
  }
  return `₹${(cost / 100).toFixed(2)}`;
}
