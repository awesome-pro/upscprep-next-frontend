"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/types/enums";
import { UserStatus, UserStatistics } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { Users, UserCheck, UserX, UserPlus, Activity } from "lucide-react";

export function UserStatisticsCards() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['user-statistics'],
    queryFn: async () => userService.getUserStatistics(),
  });

  // Role card data
  const roleCards = [
    {
      title: "Total Users",
      value: statistics?.totalUsers || 0,
      icon: <Users className="h-6 w-6" />,
      description: "All registered users",
      className: "bg-primary/10",
      iconClassName: "text-primary",
    },
    {
      title: "Students",
      value: statistics?.byRole?.[UserRole.STUDENT] || 0,
      icon: <Users className="h-6 w-6" />,
      description: "Enrolled students",
      className: "bg-blue-500/10",
      iconClassName: "text-blue-500",
    },
    {
      title: "Teachers",
      value: statistics?.byRole?.[UserRole.TEACHER] || 0,
      icon: <Users className="h-6 w-6" />,
      description: "Active teachers",
      className: "bg-amber-500/10",
      iconClassName: "text-amber-500",
    },
    {
      title: "Admins",
      value: statistics?.byRole?.[UserRole.ADMIN] || 0,
      icon: <Users className="h-6 w-6" />,
      description: "System administrators",
      className: "bg-red-500/10",
      iconClassName: "text-red-500",
    },
  ];

  // Status card data
  const statusCards = [
    {
      title: "Active Users",
      value: statistics?.byStatus?.[UserStatus.ACTIVE] || 0,
      icon: <UserCheck className="h-6 w-6" />,
      description: "Currently active users",
      className: "bg-green-500/10",
      iconClassName: "text-green-500",
    },
    {
      title: "Pending Users",
      value: statistics?.byStatus?.[UserStatus.VERIFICATION_PENDING] || 0,
      icon: <UserX className="h-6 w-6" />,
      description: "Awaiting verification",
      className: "bg-yellow-500/10",
      iconClassName: "text-yellow-500",
    },
    {
      title: "New Users (30d)",
      value: statistics?.newUsersLast30Days || 0,
      icon: <UserPlus className="h-6 w-6" />,
      description: "Joined in last 30 days",
      className: "bg-purple-500/10",
      iconClassName: "text-purple-500",
    },
    {
      title: "Active Users (30d)",
      value: statistics?.activeUsersLast30Days || 0,
      icon: <Activity className="h-6 w-6" />,
      description: "Active in last 30 days",
      className: "bg-indigo-500/10",
      iconClassName: "text-indigo-500",
    },
  ];

  // Skeleton for loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="h-6 w-6 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Skeleton className="h-8 w-12" />
                </div>
                <p className="text-xs text-muted-foreground">
                  <Skeleton className="h-3 w-32" />
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Statistics by Role</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roleCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`${card.className} p-2 rounded-full ${card.iconClassName}`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold pt-4">User Statistics by Status</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`${card.className} p-2 rounded-full ${card.iconClassName}`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
