'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { CreateTodoDto } from '@/types';
import { toast } from 'sonner';

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
});

export default function CreateTodoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const todoData: CreateTodoDto = {
        title: values.title,
        description: values.description,
      };
      
      await TodoService.createTodo(todoData);
      
      toast.success('Todo created successfully');
      
      router.push('/dashboard/todos');
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Failed to create todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Todo</CardTitle>
        <CardDescription>Add a new task to your todo list</CardDescription>
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
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    <span>Creating...</span>
                  </div>
                ) : 'Create Todo'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
