import { CourseLesson } from "@/types/models";
import Link from "next/link";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export type lessonColumnProps = {
  onViewLesson: (id: string) => void;
  onEditLesson: (id: string) => void;
  onDeleteLesson: (id: string) => void;
  courseId: string;
  moduleId: string;
  userRole: UserRole;
};

export const getColumns: (props: lessonColumnProps) => ColumnDef<CourseLesson>[] = (props: lessonColumnProps) => [
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: { row: { original: CourseLesson } }) => {
      const lesson = row.original;
      return (
        <Link 
          href={`/dashboard/courses/${props.courseId}/modules/${props.moduleId}/lessons/${lesson.id}`}
          className="font-medium hover:underline text-2xl font-bold"
        >
          {lesson.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: { row: { original: CourseLesson } }) => {
      const description = row.original.description || "";
      return description.length > 100 ? `${description.substring(0, 100)}...` : description;
    },
  },
  {
    accessorKey: "isPreview",
    header: "Preview",
    cell: ({ row }: { row: { original: CourseLesson } }) => {
      return row.original.isPreview ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Yes
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No
        </span>
      );
    },
  },
  {
    accessorKey: "isMandatory",
    header: "Mandatory",
    cell: ({ row }: { row: { original: CourseLesson } }) => {
      return row.original.isMandatory ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Yes
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No
        </span>
      );
    },
  },
  {
    accessorKey: "videoDuration",
    header: "More Info",
    cell: ({ row }: { row: { original: CourseLesson } }) => {
      const lesson = row.original;
      return (
        <div className="flex items-center gap-2 text-sm">
          Video Duration: {lesson.videoDuration || "N/A"}
          <br />
          Number of Videos: {lesson.videoUrls.length || "N/A"}
          <br />
          Number of Attachments: {lesson.fileUrls.length || "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: CourseLesson } }) => {
      const lesson = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => props.onViewLesson(lesson.id)}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
          {(props.userRole === UserRole.ADMIN || props.userRole === UserRole.TEACHER) && (
            <>
            <Button variant="outline" size="sm" onClick={() => props.onEditLesson(lesson.id)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => props.onDeleteLesson(lesson.id)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
            </>
          )}
        </div>
      );
    },
  },
];