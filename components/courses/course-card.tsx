'use client';

import { CourseList } from '@/types/course';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: CourseList;
}

export function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price / 100); // Convert paisa to rupees
  };

  const formatDuration = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <Badge variant={course.type === 'PRELIMS' ? 'default' : course.type === 'MAINS' ? 'secondary' : 'outline'}>
            {course.type.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Book className="mr-2 h-4 w-4" />
            <span>{course.subject}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{course.totalStudents} students enrolled</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>Valid for {formatDuration(course.duration)}</span>
          </div>
          {course.teacherName && (
            <div className="text-sm text-muted-foreground mt-2">
              By <span className="font-medium">{course.teacherName}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="font-bold text-lg">{formatPrice(course.price)}</div>
        <Button asChild>
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
