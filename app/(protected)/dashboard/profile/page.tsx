'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Loader2 } from 'lucide-react';

// Services and Types
import profileService from '@/services/profile.service';
import { User, UserStatus } from '@/types/user';
import { UserRole } from '@/types';

// Form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phoneNumber: z
    .string()
    .nullable()
    .refine(
      (val) => !val || /^\+?[0-9]{10,15}$/.test(val),
      { message: 'Please enter a valid phone number.' }
    ),
  dateOfBirth: z.date().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: null,
    },
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await profileService.getProfile();
        setUser(userData);
        
        // Set form values
        form.reset({
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [form]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      
      const updatedUser = await profileService.updateProfile({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber || undefined,
        dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, 'yyyy-MM-dd') : undefined,
      });
      
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Format role for display
  const formatRole = (role: UserRole) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with user info */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {user?.name ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription className="mt-1">{user?.email}</CardDescription>
                <Badge className="mt-2" variant="outline">
                  {user?.role ? formatRole(user.role) : 'User'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
                  <p className="mt-1">
                    <Badge variant={user?.status === UserStatus.ACTIVE ? 'success' : 'secondary'}>
                      {user?.status?.replace('_', ' ')}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                  <p className="mt-1">
                    {user?.enrollmentDate
                      ? format(new Date(user.enrollmentDate), 'MMMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                {user?.walletBalance !== undefined && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Wallet Balance</h3>
                    <p className="mt-1 font-medium">
                      ₹{(user.walletBalance / 100).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                    Update your personal information here. Your name will be displayed across the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="john.doe@example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              This email will be used for account-related notifications.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+91 9876543210" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional. Will be used for important notifications only.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span className="text-muted-foreground">Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value || undefined}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Optional. This helps us personalize your experience.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving Changes
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
            </Card>
            
        </div>
      </div>
    </div>
  );
}