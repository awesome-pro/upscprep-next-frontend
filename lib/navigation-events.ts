'use client';

import { useCallback, useEffect } from 'react';

type NavigationEventCallback = () => void;

/**
 * Hook to listen for various navigation events in Next.js
 */
export function useNavigationEvents({
  onStart,
  onComplete,
}: {
  onStart?: NavigationEventCallback;
  onComplete?: NavigationEventCallback;
}) {
  // Handle Next.js navigation events
  const handleRouteChangeStart = useCallback(() => {
    onStart?.();
  }, [onStart]);

  const handleRouteChangeComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  // Handle browser back/forward navigation
  const handlePopState = useCallback(() => {
    onStart?.();
    // We need to delay the completion slightly to simulate navigation time
    setTimeout(() => onComplete?.(), 300);
  }, [onStart, onComplete]);

  // Handle link clicks that might trigger navigation
  const handleLinkClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      // Only handle internal links that will cause navigation
      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        link.href !== window.location.href &&
        !link.target &&
        !link.hasAttribute('download') &&
        !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      ) {
        onStart?.();
      }
    },
    [onStart]
  );

  useEffect(() => {
    // Add event listeners for Next.js router events
    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleLinkClick);
      window.addEventListener('popstate', handlePopState);

      // Add event listeners for Next.js router events
      const nextNavigationEvents = (window as any).__NEXT_NAVIGATION_EVENTS;
      if (nextNavigationEvents) {
        nextNavigationEvents.on('routeChangeStart', handleRouteChangeStart);
        nextNavigationEvents.on('routeChangeComplete', handleRouteChangeComplete);
        nextNavigationEvents.on('routeChangeError', handleRouteChangeComplete);
      }
    }

    return () => {
      // Clean up event listeners
      if (typeof window !== 'undefined') {
        document.removeEventListener('mousedown', handleLinkClick);
        window.removeEventListener('popstate', handlePopState);

        const nextNavigationEvents = (window as any).__NEXT_NAVIGATION_EVENTS;
        if (nextNavigationEvents) {
          nextNavigationEvents.off('routeChangeStart', handleRouteChangeStart);
          nextNavigationEvents.off('routeChangeComplete', handleRouteChangeComplete);
          nextNavigationEvents.off('routeChangeError', handleRouteChangeComplete);
        }
      }
    };
  }, [handleLinkClick, handlePopState, handleRouteChangeStart, handleRouteChangeComplete]);
}
