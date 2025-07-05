'use client';

import { useState, useEffect } from 'react';
import { CourseList, CourseType } from '@/types/course';
import { courseService } from '@/services/course.service';
import { CourseCard } from './course-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseListComponentProps {
  initialCourses?: CourseList[];
}

export function CourseListComponent({ initialCourses }: CourseListComponentProps) {
  const [courses, setCourses] = useState<CourseList[]>(initialCourses || []);
  const [loading, setLoading] = useState(!initialCourses);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<CourseType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!initialCourses) {
      fetchCourses();
    }
  }, [initialCourses]);

  const fetchCourses = async (type?: CourseType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getCourses(type);
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (value: string) => {
    const selectedType = value as CourseType | 'ALL';
    setTypeFilter(selectedType);
    
    if (selectedType === 'ALL') {
      fetchCourses();
    } else {
      fetchCourses(selectedType as CourseType);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full md:w-64">
          <Label htmlFor="course-type">Filter by Type</Label>
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger id="course-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value={CourseType.PRELIMS}>Prelims</SelectItem>
              <SelectItem value={CourseType.MAINS}>Mains</SelectItem>
              <SelectItem value={CourseType.PRELIMS_MAINS_COMBO}>Prelims & Mains Combo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-grow">
          <Label htmlFor="search">Search Courses</Label>
          <Input 
            id="search"
            placeholder="Search by title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[320px]">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
