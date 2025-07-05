'use client';

import React, { useEffect, useState } from 'react';
import { useStreak } from '@/hooks/useStreak';
import { CalendarIcon, FlameIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakDisplayProps {
  compact?: boolean;
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { getStreak } = useStreak();
  const [streakData, setStreakData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      const data = await getStreak();
      setStreakData(data);
      setLoading(false);
    };

    fetchStreak();
  }, []);

  if (loading) {
    return compact ? (
      <div className="flex items-center">
        <FlameIcon className="h-4 w-4 mr-1 text-orange-500" />
        <Skeleton className="h-4 w-8" />
      </div>
    ) : (
      <div className="flex items-center p-2 bg-muted/50 rounded-md">
        <FlameIcon className="h-5 w-5 mr-2 text-orange-500" />
        <Skeleton className="h-5 w-16" />
      </div>
    );
  }

  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-help">
              <FlameIcon className={`h-4 w-4 mr-1 ${currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">{currentStreak}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-xs">
              <p>Current streak: {currentStreak} days</p>
              <p>Longest streak: {longestStreak} days</p>
              <p>Total active days: {streakData?.totalDays || 0}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center p-2 bg-muted/50 rounded-md">
      <FlameIcon className={`h-5 w-5 mr-2 ${currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
      <div>
        <div className="text-sm font-medium">{currentStreak} day streak</div>
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarIcon className="h-3 w-3 mr-1" />
          Best: {longestStreak} days
        </div>
      </div>
    </div>
  );
}
