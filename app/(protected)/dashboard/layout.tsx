"use client";

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect } from 'react'
import { UserStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileUploadProvider } from '@/contexts/file-upload-context';
import { IconExclamationCircle } from '@tabler/icons-react';
import { TopBar } from '@/components/top-bar';
import { PaymentProvider } from '@/providers/payment-provider';
import { LoaderCircleIcon, LoaderPinwheel } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FileUploadProvider>
          <SidebarProvider
            style={{
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
          >
            <PaymentProvider> 
              {children}
            </PaymentProvider>
          </SidebarProvider>
        </FileUploadProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Component to display status-specific alerts with actions
function StatusAlert({ status, onAction }: { status: UserStatus, onAction: () => void }) {
  const messages = {
    [UserStatus.ACTIVE]: {
      title: '',
      description: '',
      action: '',
      redirect: ''
    },
    [UserStatus.DELETED]: {
      title: 'Account Deleted',
      description: 'Your account has been deleted. Please contact support for assistance.',
      action: 'Contact Support',
      redirect: '/deleted'
    },
    [UserStatus.SUSPENDED]: {
      title: 'Account Suspended',
      description: 'Your account has been suspended. Please contact support for assistance.',
      action: 'Contact Support',
      redirect: '/suspended'
    },
    [UserStatus.INACTIVE]: {
      title: 'Account Inactive',
      description: 'Your account is currently inactive. Please reactivate your account to continue.',
      action: 'Reactivate Account',
      redirect: '/inactive'
    }
  };


  return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-8">
      <IconExclamationCircle className="h-4 w-4" />
      <AlertDescription className="mt-2">
        <Button onClick={onAction} variant="destructive">
          Test
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  // Handle user status redirects
  useEffect(() => {
    if (user && user.status !== UserStatus.ACTIVE) {
      const redirectMap = {
        [UserStatus.SUSPENDED]: '/suspended',
        [UserStatus.INACTIVE]: '/inactive',
        [UserStatus.DELETED]: '/deleted',
        [UserStatus.VERIFICATION_PENDING]: '/verification-pending'
      };
      
      const redirectPath = redirectMap[user.status];
      if (redirectPath) {
        router.push(redirectPath);
      }
    }
  }, [user, router]);

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderPinwheel className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Handle unauthenticated users
  if (!user) {
    router.push('/auth/sign-in');
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircleIcon className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Handle non-active users with status alerts
  if (user.status !== UserStatus.ACTIVE) {
    const handleStatusAction = () => {
      const redirectMap = {
        [UserStatus.ACTIVE]: '/dashboard',
        [UserStatus.SUSPENDED]: '/suspended',
        [UserStatus.INACTIVE]: '/inactive',
        [UserStatus.DELETED]: '/deleted',
        [UserStatus.VERIFICATION_PENDING]: '/verification-pending'
      };
      
      const redirectPath = redirectMap[user.status];
      if (redirectPath) {
        router.push(redirectPath);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <StatusAlert status={user.status} onAction={handleStatusAction} />
      </div>
    );
  }

  // Only active users can access protected content
  return (
    <Providers>
      <AppSidebar variant="inset" />
      <main className="w-full">
        <TopBar />
        <div className="h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </Providers>
  );
}

export default DashboardLayout
