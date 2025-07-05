'use client';

import { useState, useEffect } from 'react';
import { CourseModule } from '@/types/course';
import { moduleService } from '@/services/module.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import Link from 'next/link';

interface ModuleDetailProps {
  moduleId: string;
  courseId: string;
  initialModule?: CourseModule;
}

export function ModuleDetail({ moduleId, courseId, initialModule }: ModuleDetailProps) {
  const [module, setModule] = useState<CourseModule | null>(initialModule || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialModule) {
      fetchModule();
    }
  }, [moduleId, initialModule]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moduleService.getModuleById(courseId, moduleId);
      setModule(data);
    } catch (err) {
      setError('Failed to load module. Please try again later.');
      console.error('Error fetching module:', err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div className="flex justify-center py-12">Loading module...</div>;
  }

  if (error || !module) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Module not found'}</p>
        <Button asChild className="mt-4">
          <Link href={`/courses/${courseId}`}>Back to Course</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/courses/${courseId}`} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Course
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{module.title}</h1>
        {module.description && (
          <p className="text-muted-foreground mt-2">{module.description}</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lessons</h2>
        
        {module.lessons && module.lessons.length > 0 ? (
          <div className="grid gap-4">
            {module.lessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden transition-all hover:shadow-md">
                <Link href={`/courses/lessons/${lesson.id}`}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        {lesson.description && (
                          <CardDescription className="mt-1">{lesson.description}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Button size="sm" variant="secondary">
                          <div className="flex items-center">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Watch
                          </div>
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No lessons available in this module yet.
          </div>
        )}
      </div>
    </div>
  );
}
