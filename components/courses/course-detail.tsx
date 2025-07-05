'use client';

import { useState, useEffect } from 'react';
import { CourseDetail } from '@/types/course';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/hooks/useProgress';
import { EntityType } from '@/types/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Clock, FileText, Users } from 'lucide-react';
import { ModuleList } from './module-list';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types';
import Link from 'next/link';

interface CourseDetailComponentProps {
  course: CourseDetail;
}

export function CourseDetailComponent({ course }: CourseDetailComponentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { user } = useAuth();
  const { updateProgress } = useProgress();
  
  // Track course visit when component mounts
  useEffect(() => {
    updateProgress({
      entityId: course.id,
      entityType: EntityType.COURSE,
    });
  }, [course.id, activeTab]);

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

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} min`;
  };

  return (
    <section className="p-8">
      {/* Course Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={course.type === 'PRELIMS' ? 'default' : course.type === 'MAINS' ? 'secondary' : 'outline'}>
              {course.type.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">{course.subject}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4" />
              <span>{course.totalStudents} students enrolled</span>
            </div>
            <div className="flex items-center text-sm">
              <Book className="mr-2 h-4 w-4" />
              <span>{course.totalModules} modules</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4" />
              <span>{formatMinutes(course.totalDuration)} total content</span>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="mr-2 h-4 w-4" />
              <span>Valid for {formatDuration(course.duration)}</span>
            </div>
          </div>
          
          {course.teacherName && (
            <div className="text-sm pt-2">
              Created by <span className="font-medium">{course.teacherName}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          {
            (user?.role == UserRole.TEACHER || user?.role == UserRole.ADMIN) ? (
              <Button className="w-full" size={'lg'} onClick={() => router.push(`/dashboard/courses/${course.id}/modules`)}>
                Edit Course
              </Button>
            ) : (
              course.isPurchased ? (
                <div className="space-y-4">
                  <Button asChild>
                    <Link href={`/dashboard/courses/${course.id}/modules`}>Continue Learning</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Access valid until {new Date(course.validTill!).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <Button className="w-full" size={'lg'} onClick={() => router.push(`/dashboard/enrollments?courseId=${course.id}`)}>
                  Enroll Now
                </Button>
              )
            )
          }
        </div>
      </div>
      
      {/* Course Content Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-8 p-5 bg-white dark:bg-black rounded-lg">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="content" id="course-content">Course Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">About This Course</h3>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            {course.images && course.images.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {
                  course.images.map((image) => (
                    <Image
                      key={image}
                      src={image}
                      alt={course.title}
                      width={500}
                      height={500}
                    />
                  ))
                }
              </div>
            )}


            <div className="flex flex-wrap gap-4">
              {
                course.images && course.images.map((image) => (
                  <Image
                    key={image}
                    src={image}
                    alt={course.title}
                    width={500}
                    height={500}
                  />
               ))
            }
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.modules?.slice(0, 4).map((module) => (
                  <li key={module.id} className="flex items-start">
                    <div className="mr-2">•</div>
                    <span>{module.title}</span>
                  </li>
                ))}
                {course.modules && course.modules.length > 4 && (
                  <li className="flex items-start">
                    <div className="mr-2">•</div>
                    <span>And {course.modules.length - 4} more modules...</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Course Content</h3>
            <p className="text-muted-foreground">
              {course.totalModules} modules • {course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0)} lessons • {formatMinutes(course.totalDuration)} total length
            </p>
            
            {course.modules && course.modules.length > 0 ? (
              <ModuleList modules={course.modules} isPurchased={course.isPurchased} />
            ) : (
              <p className="text-muted-foreground py-4">No modules available for this course yet.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Course Features</h3>
            <ul className="space-y-2">
              {course.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-2 text-primary">•</div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
