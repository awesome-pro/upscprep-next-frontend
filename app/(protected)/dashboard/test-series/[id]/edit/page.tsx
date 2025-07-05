"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TestSeriesForm } from "../../components/test-series-form";
import { TestSeriesService } from "@/services/test-series-service";
import type { TestSeries } from "@/types/exams";
import { LoaderCircleIcon } from "lucide-react";

export default function EditTestSeriesPage() {
  const { id } = useParams() as { id: string };
  const [testSeries, setTestSeries] = useState<TestSeries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        const data = await TestSeriesService.getTestSeriesById(id);
        setTestSeries(data);
      } catch (err) {
        console.error("Error fetching test series:", err);
        setError("Failed to load test series. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestSeries();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
       <LoaderCircleIcon className="animate-spin w-4 h-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!testSeries) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
          <p>Test series not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Test Series</h1>
        <p className="text-muted-foreground">
          Update the details and exams for this test series.
        </p>
      </div>
      <TestSeriesForm testSeriesId={id} initialData={testSeries} />
    </div>
  );
}
