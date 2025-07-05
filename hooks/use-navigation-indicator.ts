'use client';

import { useEffect, useState } from 'react';
import { useNavigationProgress } from '@/providers/navigation-progress';

interface UseNavigationIndicatorOptions {
  /**
   * Whether to automatically show the indicator when the component mounts
   * @default false
   */
  autoStart?: boolean;
  /**
   * Whether to automatically complete the indicator when the component unmounts
   * @default true
   */
  autoComplete?: boolean;
  /**
   * The variant of the progress bar to use
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'error';
}

/**
 * Hook to manually control the navigation progress indicator
 * 
 * @example
 * ```tsx
 * const { start, complete, setSuccess, setError } = useNavigationIndicator();
 * 
 * // Start the indicator
 * const handleClick = () => {
 *   start();
 *   // Do something async
 *   setTimeout(() => {
 *     // Complete the indicator
 *     complete();
 *     // Or set success
 *     setSuccess();
 *     // Or set error
 *     setError();
 *   }, 1000);
 * };
 * ```
 */
export function useNavigationIndicator({
  autoStart = false,
  autoComplete = true,
  variant = 'default',
}: UseNavigationIndicatorOptions = {}) {
  const { start, complete, setVariant } = useNavigationProgress();
  const [isActive, setIsActive] = useState(false);

  // Set the variant when it changes
  useEffect(() => {
    setVariant(variant);
  }, [variant, setVariant]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      start();
      setIsActive(true);
    }

    // Auto-complete on unmount if active
    return () => {
      if (autoComplete && isActive) {
        complete();
        setIsActive(false);
      }
    };
  }, [autoStart, autoComplete, start, complete, isActive]);

  const startIndicator = () => {
    setVariant('default');
    start();
    setIsActive(true);
  };

  const completeIndicator = () => {
    complete();
    setIsActive(false);
  };

  const setSuccess = () => {
    setVariant('success');
    complete();
    setIsActive(false);
  };

  const setError = () => {
    setVariant('error');
    complete();
    setIsActive(false);
  };

  return {
    start: startIndicator,
    complete: completeIndicator,
    setSuccess,
    setError,
    isActive,
  };
}
