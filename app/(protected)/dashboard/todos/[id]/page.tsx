'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { TodoService } from '@/services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Check, Edit, Trash, X } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const todoId = params.id as string;

  const { data: todo, isLoading, error, refetch } = useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => TodoService.getTodoById(todoId),
    enabled: !!todoId,
  });

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await TodoService.deleteTodo(todoId);
      toast.success('Todo deleted successfully');
      router.push('/dashboard/todos');
    } catch (error) {
      toast.error('Failed to delete todo');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleCompletion = async () => {
    try {
      setIsToggling(true);
      await TodoService.toggleTodoCompletion(todoId);
      toast.success(`Todo marked as ${todo?.isCompleted ? 'pending' : 'completed'}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update todo status');
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-destructive/20 p-4 rounded-md">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>Failed to load todo details. Please try again later.</p>
          <Button variant="outline" onClick={() => router.push('/dashboard/todos')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todos
          </Button>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-muted p-4 rounded-md">
          <h2 className="text-lg font-semibold">Todo not found</h2>
          <p>The requested todo could not be found.</p>
          <Button variant="outline" onClick={() => router.push('/dashboard/todos')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todos
          </Button>
        </div>
      </div>
    );
  }

  return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{todo.title}</CardTitle>
              <CardDescription>
                Created on {format(new Date(todo.createdAt), 'PPP')}
              </CardDescription>
            </div>
            <Badge variant={todo.isCompleted ? 'success' : 'outline'}>
              {todo.isCompleted ? (
                <div className="flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <X className="h-3.5 w-3.5" />
                  <span>Pending</span>
                </div>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="whitespace-pre-wrap">{todo.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
              <p>{format(new Date(todo.updatedAt), 'PPP p')}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant={todo.isCompleted ? "outline" : "default"}
            onClick={handleToggleCompletion}
            disabled={isToggling}
          >
            {isToggling ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <>
                {todo.isCompleted ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Mark as Pending
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Mark as Completed
                  </>
                )}
              </>
            )}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/todos/${todoId}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this todo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
  );
}
