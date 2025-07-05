import { Question, QuestionType, Difficulty } from "@/types/exams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserRole } from "@/types";

export type QuestionColumnProps = {
  onViewQuestion: (id: string) => void;
  onEditQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  examId: string;
  userRole: UserRole;
};

// Helper function to get badge variant for difficulty
const getDifficultyBadgeVariant = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY:
      return "bg-green-50 text-green-700 border-green-200";
    case Difficulty.MEDIUM:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case Difficulty.HARD:
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "";
  }
};

export const getColumns = (props: QuestionColumnProps) => [
  {
    accessorKey: "questionNumber",
    header: "Order",
    cell: ({ row }: { row: { original: Question } }) => {
      return row.original.questionNumber;
    },
  },
  {
    accessorKey: "text",
    header: "Question",
    cell: ({ row }: { row: { original: Question } }) => {
      const question = row.original;
      const text = question.text || "";
      return (
        <div className="max-w-[400px] truncate">
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: { row: { original: Question } }) => {
      const type = row.original.type;
      return (
        <Badge variant={type === QuestionType.MCQ ? "default" : "secondary"}>
          {type === QuestionType.MCQ ? "Multiple Choice" : "Descriptive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "marks",
    header: "Marks",
    cell: ({ row }: { row: { original: Question } }) => {
      return row.original.marks;
    },
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }: { row: { original: Question } }) => {
      const difficulty = row.original.difficulty;
      return (
        <Badge variant="outline" className={getDifficultyBadgeVariant(difficulty)}>
          {difficulty}
        </Badge>
      );
    },
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }: { row: { original: Question } }) => {
      return row.original.topic || "N/A";
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }: { row: { original: Question } }) => {
      const isActive = row.original.isActive;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: Question } }) => {
      const question = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => props.onViewQuestion(question.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>View question</TooltipContent>
          </Tooltip>

          {(props.userRole === UserRole.ADMIN || props.userRole === UserRole.TEACHER) && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => props.onEditQuestion(question.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>Edit question</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => props.onDeleteQuestion(question.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>Delete question</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
  },
];
