import { AuthProvider } from '@/hooks/use-auth';
import { CourseEnrollmentsProvider } from '@/hooks/use-course-enrollments';
import { TestSeriesEnrollmentsProvider } from '@/hooks/use-test-series-enrollments';
import { TanstackQueryProvider } from '@/providers/tanstack-query';
import { ThemeProvider } from '@/providers/theme';
import React from 'react'

function ProtectedLayout(
    {children}: Readonly<{
        children: React.ReactNode;
      }>
) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
    <AuthProvider>
        <TanstackQueryProvider>
            <CourseEnrollmentsProvider>
                <TestSeriesEnrollmentsProvider>
                    {children}
                </TestSeriesEnrollmentsProvider>
            </CourseEnrollmentsProvider>
        </TanstackQueryProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default ProtectedLayout
