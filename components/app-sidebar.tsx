"use client"

import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconCoin,
  IconUser,
  IconMapDollar,
  IconSTurnDown,
  IconVaccine,
  IconPdf,
  IconCheckbox,
  IconBook,
} from "@tabler/icons-react"
import { UserRole } from "@/types"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

// Define navigation items with role-based access
const navItems = {
  common: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.ADMIN],
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: IconBook,
      roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.ADMIN],
    },
    {
      title: "Test Series",
      url: "/dashboard/test-series",
      icon: IconFileWord,
      roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.ADMIN],
    },
    {
      title: "Todos",
      url: "/dashboard/todos",
      icon: IconCheckbox,
      roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.ADMIN],
    },
  ],
  
  teacher: [
    {
      title: "Students",
      url: "/dashboard/students",
      icon: IconUser,
      roles: [UserRole.TEACHER, UserRole.ADMIN],
    },
    {
      title: "Exams",
      url: "/dashboard/exams",
      icon: IconSTurnDown,
      roles: [UserRole.TEACHER, UserRole.ADMIN],
    },
    {
      title: "Students Attempt",
      url: "/dashboard/students-attempt",
      icon: IconUser,
      roles: [UserRole.TEACHER, UserRole.ADMIN],
    },
  ],

  student: [
    {
      title: "Enrollments",
      url: "/dashboard/enrollments",
      icon: IconDashboard,
      roles: [UserRole.STUDENT],
    },
    {
      title: "Exams",
      url: "/dashboard/exams",
      icon: IconVaccine,
      roles: [UserRole.STUDENT],
    },
  ],
  
  admin: [
    {
      title: "Teachers",
      url: "/dashboard/teachers",
      icon: IconCoin,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: IconListDetails,
      roles: [UserRole.ADMIN],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUser,
      roles: [UserRole.STUDENT, UserRole.ADMIN],
    },
    {
      title: "Exams",
      url: "/dashboard/exams",
      icon: IconFileWord,
      roles: [UserRole.ADMIN],
    },
  ],
};

const data = {
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: IconUser
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  
  // Generate navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];
    
    // Start with common items
    let items = [...navItems.common];
    
    // Add role-specific items
    switch (user.role) {
      case UserRole.TEACHER:
        items = [...items, ...navItems.teacher];
        break;
      case UserRole.STUDENT:
        items = [...items, ...navItems.student];
        break;
      case UserRole.ADMIN:
        items = [...items, ...navItems.admin];
        break;
      case UserRole.ADMIN:
        // Admin gets access to all navigation items
        items = [
          ...items,
          ...navItems.teacher,
          ...navItems.student,
          ...navItems.admin,
        ];
        break;
      default:
        // Default to just common items
        break;
    }
    
    return items;
  };
  
  const roleBasedNavItems = getNavItems();
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <Image src="/logo1.png" alt="WebVar" width={100} height={100} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={roleBasedNavItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
