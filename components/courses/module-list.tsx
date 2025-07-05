'use client';

import { useState } from 'react';
import { CourseModule } from '@/types/course';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProgress } from '@/hooks/useProgress';
import { EntityType } from '@/types/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, File, Lock, PlayCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ModuleListProps {
  modules: CourseModule[];
  isPurchased?: boolean;
}

export function ModuleList({ modules, isPurchased = false }: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const { updateProgress } = useProgress();
  const params = useParams();
  const courseId = params.courseId as string;
  
  
  // Track when a module is expanded
  const handleModuleExpand = (moduleId: string, isOpen: boolean) => {
    if (isOpen && !expandedModules.includes(moduleId)) {
      setExpandedModules(prev => [...prev, moduleId]);
      
      // Record module view in progress tracking
      updateProgress({
        entityId: moduleId,
        entityType: EntityType.MODULE,
      });
    } else if (!isOpen) {
      setExpandedModules(prev => prev.filter(id => id !== moduleId));
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${remainingMinutes} min`;
  };

  return (
    <Accordion 
      type="multiple" 
      className="w-full"
      onValueChange={(values) => {
        modules.forEach(module => {
          const isCurrentlyExpanded = values.includes(module.id);
          const wasPreviouslyExpanded = expandedModules.includes(module.id);
          
          if (isCurrentlyExpanded !== wasPreviouslyExpanded) {
            handleModuleExpand(module.id, isCurrentlyExpanded);
          }
        });
      }}
    >
      {modules.map((module) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start text-left">
              <div className="font-medium">{module.title}</div>
              {module.description && (
                <div className="text-sm text-muted-foreground mt-1">{module.description}</div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {module.lessons && module.lessons.length > 0 ? (
                module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className="flex items-center justify-between p-3 rounded-md hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary">
                        <PlayCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(lesson.videoDuration!)}
                          </div>
                          {lesson.isPreview && (
                            <Badge variant="outline" className="text-xs">Preview</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {isPurchased || lesson.isPreview ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                          className="text-primary hover:text-primary"
                        >
                          <Link href={`/dashboard/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`}>
                            Watch
                          </Link>
                        </Button>
                      ) : (
                        <div className="flex items-center text-muted-foreground">
                          <Lock className="h-4 w-4 mr-1" />
                          <span className="text-xs">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground py-2">No lessons available in this module yet.</div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
