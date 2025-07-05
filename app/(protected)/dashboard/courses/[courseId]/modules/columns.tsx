import { CourseModule } from "@/types/models";
import Link from "next/link";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, LayoutGrid } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type ModuleColumnProps = {
  onViewModule: (id: string) => void;
  onEditModule: (id: string) => void;
  onDeleteModule: (id: string) => void;
  onViewLessons: (id: string) => void;
  courseId: string;
  userRole: UserRole;
};

export const getColumns: (props: ModuleColumnProps) => ColumnDef<CourseModule>[] = (props: ModuleColumnProps) => [
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }: { row: { original: CourseModule } }) => row.original.order,
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }: { row: { original: CourseModule } }) => {
      const images = row.original.images || [];
      return (
        <div className="flex items-center gap-2">
          {
            images.length > 0 && images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt="Module Image"
                width={200}
                height={100}
              />
            ))
          }
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }: { row: { original: CourseModule } }) => {
      const module = row.original;
      return (
        <span className="flex flex-col items-start w-full h-full">
          <Link 
            href={`/dashboard/courses/${props.courseId}/modules/${module.id}`}
            className="font-medium hover:underline text-2xl font-bold"
          >
            {module.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            {module.description}
          </p>
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: { row: { original: CourseModule } }) => {
      return row.original.isActive ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Inactive
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: CourseModule } }) => {
      const module = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={() => props.onViewModule(module.id)}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
          <Button variant="outline" size="sm" onClick={() => props.onViewLessons(module.id)}>
            <LayoutGrid className="mr-2 h-4 w-4" /> Lessons
          </Button>
          {(props.userRole === UserRole.ADMIN || props.userRole === UserRole.TEACHER) && (
            <>
              <Button variant="outline" size="sm" onClick={() => props.onEditModule(module.id)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                // className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => props.onDeleteModule(module.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
