'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useNavigationEvents } from '@/lib/navigation-events';

const progressVariants = cva(
  'fixed top-0 left-0 right-0 h-1 bg-gradient-to-r z-50 transition-all',
  {
    variants: {
      variant: {
        default: 'from-teal-500 via-teal-600 to-primary',
        success: 'from-green-500 via-green-600 to-emerald-600',
        error: 'from-red-500 via-red-600 to-rose-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface NavigationProgressProps {
  /**
   * The minimum duration of the progress animation in milliseconds
   * @default 300
   */
  minDuration?: number;
  /**
   * The delay before the progress bar disappears after reaching 100%
   * @default 400
   */
  hideDelay?: number;
  /**
   * The variant of the progress bar
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'error';
  /**
   * Custom class name for the progress bar
   */
  className?: string;
  /**
   * Function to register the start navigation function
   */
  registerStartFn?: (fn: () => void) => void;
  /**
   * Function to register the complete navigation function
   */
  registerCompleteFn?: (fn: () => void) => void;
}

export function NavigationProgress({
  minDuration = 300,
  hideDelay = 400,
  variant = 'default',
  className,
  registerStartFn,
  registerCompleteFn,
}: NavigationProgressProps) {
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout>(null);
  const startTimeRef = useRef<number>(0);
  const isNavigatingRef = useRef<boolean>(false);

  const startProgress = () => {
    // Don't restart if already navigating
    if (isNavigatingRef.current) return;
    
    clearInterval(progressIntervalRef.current as NodeJS.Timeout);
    clearTimeout(hideTimeoutRef.current as NodeJS.Timeout);
    
    setVisible(true);
    setIsNavigating(true);
    isNavigatingRef.current = true;
    setProgress(0);
    startTimeRef.current = Date.now();

    // Quickly advance to 30% to give immediate feedback
    setTimeout(() => setProgress(30), 50);

    // Then gradually increase up to 90%
    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(progressIntervalRef.current as NodeJS.Timeout);
          return 90;
        }
        
        // Slow down as we get closer to 90%
        const increment = (90 - prevProgress) / 10;
        return prevProgress + Math.max(0.5, increment);
      });
    }, 100);
  };

  const completeProgress = () => {
    // Don't complete if not navigating
    if (!isNavigatingRef.current) return;
    
    clearInterval(progressIntervalRef.current as NodeJS.Timeout);
    
    const elapsedTime = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, minDuration - elapsedTime);

    // Ensure minimum animation time
    setTimeout(() => {
      setProgress(100);
      setIsNavigating(false);
      isNavigatingRef.current = false;
      
      // Hide the progress bar after it completes
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        // Reset progress after animation completes
        setTimeout(() => setProgress(0), 200);
      }, hideDelay);
    }, remainingTime);
  };

  // Register the start and complete functions with the provider if available
  useEffect(() => {
    registerStartFn?.(startProgress);
    registerCompleteFn?.(completeProgress);
    // We're intentionally not including startProgress and completeProgress in the
    // dependency array as they're defined in the component body and would cause
    // infinite re-renders
  }, [registerStartFn, registerCompleteFn]);
  
  // Use our custom navigation events hook
  useNavigationEvents({
    onStart: startProgress,
    onComplete: completeProgress
  });
  
  // Also track route changes via pathname and searchParams
  useEffect(() => {
    // This effect will run on initial render and subsequent route changes
    if (pathname) {
      // Don't trigger on initial render
      if (document.readyState === 'complete') {
        completeProgress();
      }
    }
    
    // Cleanup on unmount
    return () => {
      clearInterval(progressIntervalRef.current as NodeJS.Timeout);
      clearTimeout(hideTimeoutRef.current as NodeJS.Timeout);
    };
  }, [pathname]);

  return (
    <div
      className={cn(
        progressVariants({ variant }),
        visible ? 'opacity-100' : 'opacity-0',
        className,
        'z-[1000]'
      )}
      style={{
        width: `${progress}%`,
        transition: `width ${isNavigating ? '0.2s' : '0.1s'} ease-in-out, opacity 0.2s ease-in-out`,
        boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
      }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    />
  );
}
