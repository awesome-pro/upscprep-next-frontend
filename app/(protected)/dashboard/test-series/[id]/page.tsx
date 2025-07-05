"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TestSeriesService } from "@/services/test-series-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/spinner";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, CheckCircle, Clock, Edit, ExternalLink, FileText, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { format } from "date-fns";
import { ExamType } from "@/types/exams";

export default function TestSeriesDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const { data: testSeries, isLoading, error } = useQuery({
    queryKey: ["test-series", id],
    queryFn: () => TestSeriesService.getTestSeriesById(id as string),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !testSeries) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Error loading test series</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load test series details"}
        </p>
        <Button asChild>
          <Link href="/dashboard/test-series">Back to Test Series</Link>
        </Button>
      </div>
    );
  }

  const isAdmin = user?.role === UserRole.ADMIN;
  const isTeacher = user?.role === UserRole.TEACHER;
  const canEdit = isAdmin || (isTeacher && user?.id === testSeries.teacherId);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{testSeries.title}</h1>
            <Badge variant={testSeries.isActive ? "success" : "secondary"}>
              {testSeries.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={testSeries.type === ExamType.PRELIMS ? "default" : "outline"}>
              {testSeries.type}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            Created by {testSeries.teacher?.name || "Unknown Teacher"}
          </p>
        </div>

        {canEdit && (
          <div className="flex gap-2">
            {/* <Button asChild variant="outline">
              <Link href={`/dashboard/test-series/${id}/exams`}>
                <FileText className="mr-2 h-4 w-4" />
                Manage Exams
              </Link>
            </Button> */}
            <Button asChild>
              <Link href={`/dashboard/test-series/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Test Series
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="exams">
            Exams ({testSeries.exams?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="whitespace-pre-line">
                    {testSeries.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Features</h2>
                  {testSeries.features && testSeries.features.length > 0 ? (
                    <ul className="space-y-2">
                      {testSeries.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No features listed.</p>
                  )}
                </CardContent>
              </Card>

              {/* Images Gallery */}
              {testSeries.images && testSeries.images.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Images</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {testSeries.images.map((image, index) => (
                        <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`${testSeries.title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column - Meta info */}
            <div className="space-y-6">
              {/* Price and Duration */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                    <p className="text-2xl font-bold">{formatCurrency(testSeries.price)}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{testSeries.duration} days</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Tests</h3>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{testSeries.totalTests} tests</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{format(new Date(testSeries.createdAt), 'PPP')}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{format(new Date(testSeries.updatedAt), 'PPP')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6 mt-6">
          {testSeries.exams && testSeries.exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testSeries.exams.map((exam) => (
                <Card key={exam.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{exam.title}</h3>
                        <Badge variant={exam.isFree ? "secondary" : "default"}>
                          {exam.isFree ? "Free" : "Premium"}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Tag className="h-4 w-4 mr-2" />
                          <span>{exam.subject}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{exam.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{exam.totalQuestions} questions</span>
                          <span className="text-muted-foreground">{exam.totalMarks} marks</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted p-4 flex justify-between items-center">
                      <div>
                        <Badge variant="outline">{exam.type}</Badge>
                        <Badge variant="outline" className="ml-2">{exam.testType}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/dashboard/exams/${exam.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <p className="text-muted-foreground">No exams have been added to this test series yet.</p>
              {canEdit && (
                <Button asChild>
                  <Link href={`/dashboard/test-series/${id}/exams`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Exams
                  </Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

