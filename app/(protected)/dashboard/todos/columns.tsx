'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TodoItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { MoreHorizontal, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TodoService } from '@/services';
import { toast } from 'sonner';

export const columns: ColumnDef<TodoItem>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const isCompleted = row.original.isCompleted;
      return (
        <div className={isCompleted ? 'line-through text-muted-foreground' : ''}>
          {row.getValue('title')}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      const isCompleted = row.original.isCompleted;
      return (
        <div className={isCompleted ? 'line-through text-muted-foreground' : ''}>
          {description?.length > 50 ? `${description.substring(0, 50)}...` : description}
        </div>
      );
    },
  },
  {
    accessorKey: 'isCompleted',
    header: 'Status',
    cell: ({ row }) => {
      const isCompleted = row.getValue('isCompleted') as boolean;
      return (
        <Badge variant={isCompleted ? 'success' : 'outline'}>
          {isCompleted ? (
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
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return format(new Date(row.getValue('createdAt')), 'PPP');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const todo = row.original;
      
      const handleToggle = async () => {
        try {
          await TodoService.toggleTodoCompletion(todo.id);
          toast.success(`Todo marked as ${todo.isCompleted ? 'pending' : 'completed'}`);
        } catch (error) {
          toast.error('Failed to update todo status');
        }
      };

      const handleDelete = async () => {
        try {
          await TodoService.deleteTodo(todo.id);
          toast.success('Todo deleted successfully');
        } catch (error) {
          toast.error('Failed to delete todo');
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/todos/${todo.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/todos/${todo.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggle}>
              {todo.isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
