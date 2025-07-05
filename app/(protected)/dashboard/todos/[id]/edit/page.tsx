'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { TodoService } from '@/services';
import { UpdateTodoDto } from '@/types';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }).max(100, {
    message: 'Title must not exceed 100 characters.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }).max(1000, {
    message: 'Description must not exceed 1000 characters.',
  }),
  isCompleted: z.boolean(),
});

export default function EditTodoPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const todoId = params.id as string;

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      isCompleted: false,
    },
  });

  // Fetch todo data
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setIsLoading(true);
        const todo = await TodoService.getTodoById(todoId);
        
        // Set form values
        form.reset({
          title: todo.title,
          description: todo.description,
          isCompleted: todo.isCompleted,
        });
      } catch (error) {
        console.error('Error fetching todo:', error);
        toast.error('Failed to load todo data');
        router.push('/dashboard/todos');
      } finally {
        setIsLoading(false);
      }
    };

    if (todoId) {
      fetchTodo();
    }
  }, [todoId, form, router]);

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const todoData: UpdateTodoDto = {
        title: values.title,
        description: values.description,
        isCompleted: values.isCompleted,
      };
      
      await TodoService.updateTodo(todoId, todoData);
      
      toast.success('Todo updated successfully');
      
      router.push(`/dashboard/todos/${todoId}`);
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push(`/dashboard/todos/${todoId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todo
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Todo</CardTitle>
          <CardDescription>Update your todo details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter todo title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short, descriptive title for your todo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed description" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about what needs to be done.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isCompleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Mark as completed
                      </FormLabel>
                      <FormDescription>
                        Check this box if the todo is completed.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                      <span>Updating...</span>
                    </div>
                  ) : 'Update Todo'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
