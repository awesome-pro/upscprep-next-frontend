import { TestSeriesForm } from "../components/test-series-form";

export default function CreateTestSeriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Test Series</h1>
        <p className="text-muted-foreground">
          Create a new test series with exams and details.
        </p>
      </div>
      <TestSeriesForm />
    </div>
  );
}
