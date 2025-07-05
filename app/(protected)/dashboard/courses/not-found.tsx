import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function CourseNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The course, module, or lesson you're looking for doesn't exist or you don't have access to it.
      </p>
      <Button asChild size="lg">
        <Link href="/courses" className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Browse All Courses
        </Link>
      </Button>
    </div>
  );
}
