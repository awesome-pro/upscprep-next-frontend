"use client";

import { useState, useEffect } from "react";
import { Control } from "react-hook-form";
import { ExamFormValues } from "./exam-form-schema";
import { TestSeries, TestSeriesQueryParams } from "@/types/exams";
import { TestSeriesService } from "@/services/test-series-service";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus } from "lucide-react";
import Link from "next/link";

interface TestSeriesFieldProps {
  control: Control<ExamFormValues>;
}

export function TestSeriesField({ control }: TestSeriesFieldProps) {
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch test series
  useEffect(() => {
    const fetchTestSeries = async () => {
      setLoading(true);
      try {
        const params: TestSeriesQueryParams = {
          page: 1,
          pageSize: 20,
        };

        if (debouncedSearchTerm) {
          params.search = debouncedSearchTerm;
        }

        const response = await TestSeriesService.getTestSeries(params);
        setTestSeries(response.data);
      } catch (error) {
        console.error("Failed to fetch test series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSeries();
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="testSeriesId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Series (Optional)</FormLabel>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search test series..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/test-series/create">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Link>
                </Button>
              </div>

              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a test series" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {testSeries && testSeries.length > 0 ? testSeries.map((series) => (
                    <SelectItem key={series.id} value={series.id}>
                      {series.title}  
                    </SelectItem>
                  )) : (
                    <SelectItem disabled value="null">
                      No test series found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <FormDescription>
              Optionally assign this exam to a test series.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
