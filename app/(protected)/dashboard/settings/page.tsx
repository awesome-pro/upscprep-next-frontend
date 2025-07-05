"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityForm } from "@/components/profile/security-form";
import { NotificationPreferences } from "@/components/notifications/notification-preferences";

export default function SettingsPage() { 
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="security" className="space-y-4">
          <SecurityForm />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
