import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, BookOpen, ShoppingCart, PlayCircle } from "lucide-react";
import { CourseList, CourseType } from "@/types/course";
import Link from "next/link";
import { formatPrice, formatDuration } from "./column-helpers";
import { useCourseEnrollments } from "@/hooks/use-course-enrollments";

// Define badge variants that match the available variants
const getCourseTypeBadgeVariant = (type: CourseType) => {
  switch (type) {
    case CourseType.PRELIMS:
      return "secondary";
    case CourseType.MAINS:
      return "success";
    case CourseType.PRELIMS_MAINS_COMBO:
      return "outline";
    default:
      return "default";
  }
};

const getStatusBadgeVariant = (isActive: boolean) => {
  return isActive ? "success" : "destructive";
};

const getPremiumBadgeVariant = (isPremium: boolean) => {
  return isPremium ? "secondary" : "outline";
};
import { UserRole } from "@/types";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CourseColumnProps {
  userRole: UserRole;
  onDeleteCourse?: (id: string) => void;
  onViewCourse?: (id: string) => void;
  onEditCourse?: (id: string) => void;
  onViewModules?: (id: string) => void;
  onPurchaseCourse?: (id: string) => void;
  onContinueLearning?: (id: string) => void;
}

export const getColumns = ({
  userRole,
  onDeleteCourse,
  onViewCourse,
  onEditCourse,
  onViewModules,
  onPurchaseCourse,
  onContinueLearning,
}: CourseColumnProps): ColumnDef<CourseList>[] => {
  // Use the course enrollments hook
  const { isEnrolled } = useCourseEnrollments();
  const columns: ColumnDef<CourseList>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex flex-col">
            <Link 
              href={`/dashboard/courses/${course.id}`}
              className="font-medium hover:underline"
            >
              {course.title}
            </Link>
            <span className="text-xs text-muted-foreground truncate max-w-[250px]">
              {course.description}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as CourseType;
        return (
          <Badge variant={getCourseTypeBadgeVariant(type)}>
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => row.getValue("subject") || "N/A",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return formatPrice(price);
      },
    },
    {
      accessorKey: "totalModules",
      header: "Modules",
      cell: ({ row }) => row.getValue("totalModules"),
    },
    {
      accessorKey: "totalStudents",
      header: "Students",
      cell: ({ row }) => row.getValue("totalStudents"),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={getStatusBadgeVariant(isActive)}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isPremium",
      header: "Premium",
      cell: ({ row }) => {
        const isPremium = row.getValue("isPremium") as boolean;
        return (
          <Badge variant={getPremiumBadgeVariant(isPremium)}>
            {isPremium ? "Premium" : "Free"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return format(date, "yyyy-MM-dd");
      },
    },
  ];

  // Add actions column
  columns.push({
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>  
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onViewCourse?.(course.id)}
            title="View course details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={5}>
            View course details
          </TooltipContent>
          </Tooltip>
          
          {/* Show purchase or continue learning button for students */}
          {userRole === UserRole.STUDENT && (
            <Tooltip>
              <TooltipTrigger asChild>
                {isEnrolled(course.id) ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onViewModules?.(course.id)}
                    title="View modules"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => onPurchaseCourse?.(course.id)}
                    title="Purchase course"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent sideOffset={5}>
                {isEnrolled(course.id) ? "Continue learning" : "Purchase course"}
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Admin and teacher actions */}
          {(userRole === UserRole.ADMIN || userRole === UserRole.TEACHER) && (
            <>
               <Tooltip>
                <TooltipTrigger asChild>
                <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewModules?.(course.id)}
                title="View modules"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  View modules
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEditCourse?.(course.id)}
                title="Edit course"
              >
                <Edit className="h-4 w-4" />
              </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  Edit course
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => onDeleteCourse?.(course.id)}
                title="Delete course"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  Delete course
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
  });

  return columns;
};
