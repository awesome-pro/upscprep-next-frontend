'use client';

import { NavigationProgress } from '@/components/ui/navigation-progress';
import { ReactNode, createContext, useContext, useState } from 'react';

type NavigationProgressVariant = 'default' | 'success' | 'error';

interface NavigationProgressContextType {
  /**
   * Set the variant of the progress bar
   */
  setVariant: (variant: NavigationProgressVariant) => void;
  /**
   * Start the progress bar manually
   */
  start: () => void;
  /**
   * Complete the progress bar manually
   */
  complete: () => void;
  /**
   * Current variant of the progress bar
   */
  variant: NavigationProgressVariant;
}

const NavigationProgressContext = createContext<NavigationProgressContextType | null>(null);

/**
 * Hook to access and control the navigation progress bar
 */
export function useNavigationProgress() {
  const context = useContext(NavigationProgressContext);
  
  if (!context) {
    throw new Error('useNavigationProgress must be used within a NavigationProgressProvider');
  }
  
  return context;
}

interface NavigationProgressProviderProps {
  children: ReactNode;
}

export function NavigationProgressProvider({ children }: NavigationProgressProviderProps) {
  const [variant, setVariant] = useState<NavigationProgressVariant>('default');
  const [startNavigation, setStartNavigation] = useState<() => void>(() => () => {});
  const [completeNavigation, setCompleteNavigation] = useState<() => void>(() => () => {});

  return (
    <NavigationProgressContext.Provider
      value={{
        setVariant,
        variant,
        start: () => startNavigation(),
        complete: () => completeNavigation(),
      }}
    >
      <NavigationProgress 
        variant={variant}
        registerStartFn={setStartNavigation}
        registerCompleteFn={setCompleteNavigation}
      />
      {children}
    </NavigationProgressContext.Provider>
  );
}
