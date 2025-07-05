import { CourseType } from "@/types/course";

// Course type filter options
export const courseTypeFilterOptions = [
  {
    label: "All Types",
    value: "all",
  },
  {
    label: "Prelims",
    value: CourseType.PRELIMS,
  },
  {
    label: "Mains",
    value: CourseType.MAINS,
  },
  {
    label: "Combo",
    value: CourseType.PRELIMS_MAINS_COMBO,
  },
];

// Status filter options
export const statusFilterOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

// Premium filter options
export const premiumFilterOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Premium",
    value: "premium",
  },
  {
    label: "Free",
    value: "free",
  },
];

// Badge variants for course types
export const getCourseTypeBadgeVariant = (type: CourseType) => {
  switch (type) {
    case CourseType.PRELIMS:
      return "blue";
    case CourseType.MAINS:
      return "green";
    case CourseType.PRELIMS_MAINS_COMBO:
      return "purple";
    default:
      return "default";
  }
};

// Badge variants for status
export const getStatusBadgeVariant = (isActive: boolean) => {
  return isActive ? "success" : "secondary";
};

// Badge variants for premium status
export const getPremiumBadgeVariant = (isPremium: boolean) => {
  return isPremium ? "gold" : "default";
};

// Format price to INR
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Format duration in hours and minutes
export const formatDuration = (durationInMinutes: number) => {
  if (!durationInMinutes) return "N/A";
  
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
};

// Get subject filter options from a list of courses
export const getSubjectFilterOptions = (courses: any[]) => {
  const subjects = new Set<string>();
  
  courses.forEach((course) => {
    if (course.subject) {
      subjects.add(course.subject);
    }
  });
  
  return [
    {
      label: "All Subjects",
      value: "all",
    },
    ...Array.from(subjects).map((subject) => ({
      label: subject,
      value: subject,
    })),
  ];
};
