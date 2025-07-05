"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionQueryParams, QuestionType, Difficulty } from "@/types/exams";
import { QuestionService } from "@/services/question.service";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import Link from "next/link";
import { toast } from "sonner";
import { getColumns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RowSelectionState } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuestionsPage() {
  // State for data table
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [questionType, setQuestionType] = useState<QuestionType | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);

  // Get params
  const params = useParams();
  const examId = params.examId as string;
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Fetch questions
  const { data: questions, isLoading, error, refetch } = useQuery({
    queryKey: ['questions', examId, page, pageSize, search, questionType, difficulty],
    queryFn: async () => {
      const params: QuestionQueryParams = { 
        page, 
        pageSize, 
        search, 
        examId,
        type: questionType,
        difficulty
      };
      return QuestionService.getQuestions(params);
    },
  });

  // Update pagination when data changes
  useEffect(() => {
    if (questions) {
      setPagination({
        currentPage: questions.meta.currentPage,
        pageSize: questions.meta.pageSize,
        totalItems: questions.meta.total,
        totalPages: questions.meta.totalPages,
        hasNextPage: questions.meta.hasNextPage,
        hasPreviousPage: questions.meta.hasPreviousPage,
      });
    }
  }, [questions]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (questionId: string) => QuestionService.deleteQuestion(questionId),
    onSuccess: () => {
      toast.success('Question deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['questions', examId] });
      setSelectedRowCount(0);
      setRowSelection({});
    },
    onError: (error: any) => {
      toast.error(`Failed to delete question: ${error.message}`);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (questionIds: string[]) => {
      return Promise.all(questionIds.map(id => QuestionService.deleteQuestion(id)));
    },
    onSuccess: () => {
      toast.success('Questions deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['questions', examId] });
      setRowSelection({});
      setSelectedRowCount(0);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete questions: ${error.message}`);
    },
  });

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchLoading(true);
    setSearch(value);
    
    // Debounce search
    const timer = setTimeout(() => {
      setPage(1);
      setSearchLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setSelectedQuestionId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQuestion = () => {
    if (selectedQuestionId) {
      deleteMutation.mutate(selectedQuestionId);
      setDeleteDialogOpen(false);
      setSelectedQuestionId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Questions refreshed');
    } catch (error: any) {
      toast.error(`Failed to refresh questions: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle question actions
  const handleView = (id: string) => {
    router.push(`/dashboard/exams/${examId}/questions/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/exams/${examId}/questions/${id}/edit`);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => questions?.data[parseInt(index)].id
    ).filter((id) => id !== undefined) as string[];
    
    if (selectedIds.length > 0) {
      bulkDeleteMutation.mutate(selectedIds);
      setBulkDeleteDialogOpen(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => questions?.data[parseInt(index)].id
    );
    
    if (selectedIds.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  // Update row selection count
  const handleRowSelectionChange = (newSelection: RowSelectionState) => {
    setRowSelection(newSelection);
    setSelectedRowCount(Object.keys(newSelection).length);
  };

  // Bulk delete button
  const BulkDeleteButton = () => (
    selectedRowCount > 0 ? (
      <Button 
        variant="destructive" 
        onClick={handleBulkDelete}
        className="flex items-center"
        size="sm"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete {selectedRowCount} {selectedRowCount === 1 ? "Question" : "Questions"}
      </Button>
    ) : null
  );

  // Filter components
  const FilterComponents = () => (
    <div className="flex flex-wrap gap-2">
      <Select
        value={questionType || ""}
        onValueChange={(value) => setQuestionType(value ? value as QuestionType : undefined)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Question Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={QuestionType.MCQ}>Multiple Choice</SelectItem>
          <SelectItem value={QuestionType.DESCRIPTIVE}>Descriptive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={difficulty || ""}
        onValueChange={(value) => setDifficulty(value ? value as Difficulty : undefined)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Difficulty.EASY}>Easy</SelectItem>
          <SelectItem value={Difficulty.MEDIUM}>Medium</SelectItem>
          <SelectItem value={Difficulty.HARD}>Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const questionColumns = getColumns({
    userRole: user?.role || UserRole.STUDENT,
    examId,
    onDeleteQuestion: handleDelete,
    onViewQuestion: handleView,
    onEditQuestion: handleEdit,
  });

  return (
    <section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exam Questions</h1>
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
          <Button asChild>
            <Link href={`/dashboard/exams/${examId}/questions/create`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Link>
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={questionColumns}
        data={questions?.data || []}
        isLoading={isLoading}
        searchKey="text"
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchLoading={searchLoading}
        onRefresh={handleRefresh}
        refreshLoading={refreshing}
        serverSideSearch={true}
        serverPagination={{
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
          hasNextPage: pagination.hasNextPage,
          hasPreviousPage: pagination.hasPreviousPage,
          onPageChange: (page) => setPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
        rowSelection={user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER}
        rowSelectionState={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        toolbar={{
          searchPlaceholder: "Search questions by text or topic...",
          additionalButtons: <FilterComponents />
        }}
        additionalToolbarContent={<BulkDeleteButton />}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQuestion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedRowCount} {selectedRowCount === 1 ? "question" : "questions"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
