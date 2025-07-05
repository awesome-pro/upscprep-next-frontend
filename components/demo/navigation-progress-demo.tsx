'use client';

import { Button } from "@/components/ui/button";
import { useNavigationIndicator } from "@/hooks/use-navigation-indicator";
import { useNavigationProgress } from "@/providers/navigation-progress";
import { useRouter } from "next/navigation";

export function NavigationProgressDemo() {
  const router = useRouter();
  const { start, complete, setSuccess, setError } = useNavigationIndicator();
  
  const simulateNavigation = () => {
    start();
    setTimeout(() => {
      complete();
    }, 1500);
  };
  
  const simulateSuccess = () => {
    start();
    setTimeout(() => {
      setSuccess();
    }, 1500);
  };
  
  const simulateError = () => {
    start();
    setTimeout(() => {
      setError();
    }, 1500);
  };
  
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Navigation Progress Demo</h3>
      <p className="text-sm text-muted-foreground">
        The navigation progress bar appears at the top of the page during navigation.
        Try the buttons below to see it in action.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={simulateNavigation} variant="outline">
          Simulate Navigation
        </Button>
        <Button onClick={simulateSuccess} variant="outline" className="text-green-500">
          Simulate Success
        </Button>
        <Button onClick={simulateError} variant="outline" className="text-red-500">
          Simulate Error
        </Button>
        <Button onClick={() => router.push('/')} variant="default">
          Navigate Home
        </Button>
      </div>
    </div>
  );
}
