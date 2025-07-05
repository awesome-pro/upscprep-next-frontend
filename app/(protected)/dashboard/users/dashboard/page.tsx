"use client";

import { UserStatisticsCards } from "../components/user-statistics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/enums";
import Link from "next/link";
import { PlusCircle, Users, UserCheck, BookOpen } from "lucide-react";

export default function UsersDashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <section className="container mx-auto py-10 space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <UserStatisticsCards />
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Students Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Manage Students</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    View, add, edit, or delete student accounts. Manage enrollments and track progress.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/users/students">
                      <UserCheck className="mr-2 h-4 w-4" />
                      View Students
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard/users/students/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Student
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Teachers Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <BookOpen className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Manage Teachers</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    View, add, edit, or delete teacher accounts. Manage their courses, exams, and students.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/users/teachers">
                      <UserCheck className="mr-2 h-4 w-4" />
                      View Teachers
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard/users/teachers/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Teacher
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* All Users Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold">All Users</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    View and manage all users in the system including students, teachers, and administrators.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/users">
                      <UserCheck className="mr-2 h-4 w-4" />
                      View All Users
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard/users/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New User
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
