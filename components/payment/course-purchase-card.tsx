import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentButton } from '@/components/payment-button';
import { PurchaseType, CourseType } from '@/types/enums';
import { Check, Loader2, Star, Clock, Users, BookOpen, ArrowRight } from 'lucide-react';
import { CourseDetailDto } from '@/types/courses';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface CoursePurchaseCardProps {
  courseId: string;
  courseType: CourseType;
  title?: string;
  description?: string;
  onPurchaseSuccess?: () => void;
  showFullDetails?: boolean;
  courseData?: CourseDetailDto;
}

export const CoursePurchaseCard: React.FC<CoursePurchaseCardProps> = ({
  courseId,
  courseType,
  title,
  description,
  onPurchaseSuccess,
  showFullDetails = false,
  courseData
}) => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
      setLoading(false);
      return;
    }
    
  }, [courseId, courseData]);
  
  const displayTitle = course?.title || title || getCourseTypeTitle(courseType);
  const displayDescription = course?.description || description || 'Access to comprehensive study materials and tests';
  const displayPrice = course?.price || 0;
  const displayFeatures = course?.features || [];
  
  if (loading) {
    return (
      <Card className="w-full h-[500px] shadow-lg flex items-center justify-center p-8 border-2 border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p>Loading course details...</p>
        </div>
      </Card>
    );
  }
  
  if (error && !course) {
    return (
      <Card className="w-full h-[500px] shadow-lg border-2 border-gray-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle>{displayTitle}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Using default pricing information.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Determine if this is a popular or featured course (you can customize this logic)
  const isPopular = course?.totalStudents && course.totalStudents > 100;
  const isFeatured = courseType === CourseType.PRELIMS_MAINS_COMBO;
  
  return (
    <Card 
      className={cn(
        "w-full h-[500px] relative overflow-hidden transition-all duration-300 flex flex-col",
        "border-2 hover:border-primary/50 hover:shadow-xl",
        isHovered ? "shadow-lg transform translate-y-[-4px]" : "shadow-md",
        isFeatured ? "border-primary/30 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular or Featured Badge */}
      {isPopular && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" /> Popular
          </Badge>
        </div>
      )}
      {isFeatured && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-primary/20 text-primary flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary stroke-primary" /> Featured
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs font-normal">
            {getCourseTypeLabel(courseType)}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold">{displayTitle}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {displayDescription}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          {course?.totalModules && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.totalModules} modules</span>
            </div>
          )}
          {course?.totalDuration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.totalDuration} hours</span>
            </div>
          )}
          {course?.totalStudents && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.totalStudents}+ students</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">What you'll learn:</h4>
          <ul className="space-y-2">
            {displayFeatures.length > 0 ? displayFeatures.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            )) : (
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span className="text-sm">Comprehensive study materials</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-20 pointer-events-none" />
      
      <CardFooter className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-baseline justify-between w-full">
          <div className="text-2xl font-bold text-primary">
            ₹{(displayPrice / 100).toLocaleString('en-IN')}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            1 year access
          </div>
        </div>
        
        <div className="flex flex-col w-full gap-2">
          <PaymentButton
            type={PurchaseType.COURSE}
            courseId={courseId}
            amount={displayPrice}
            title={displayTitle}
            className={cn(
              "w-full transition-all", 
              course?.isPurchased ? "bg-green-600 hover:bg-green-700" : ""
            )}
            onSuccess={onPurchaseSuccess}
            disabled={course?.isPurchased}
          />
          
          
          <Link href={`/dashboard/courses/${courseId}`} className="w-full">
            <Button
              className="w-full flex items-center justify-center gap-1"
              variant="outline"
            >
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

function getCourseTypeTitle(type: CourseType): string {
  switch (type) {
    case CourseType.PRELIMS:
      return 'UPSC Prelims Course';
    case CourseType.MAINS:
      return 'UPSC Mains Course';
    case CourseType.PRELIMS_MAINS_COMBO:
      return 'UPSC Prelims + Mains Combo';
    default:
      return 'UPSC Course';
  }
}

function getCourseTypeLabel(type: CourseType): string {
  switch (type) {
    case CourseType.PRELIMS:
      return 'Prelims';
    case CourseType.MAINS:
      return 'Mains';
    case CourseType.PRELIMS_MAINS_COMBO:
      return 'Prelims + Mains';
    default:
      return 'Course';
  }
}
