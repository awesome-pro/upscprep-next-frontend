"use client";

import { Exam, ExamType, TestType } from "@/types/exams";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Users, 
  Clock, 
  Award
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface ExamHeaderProps {
  exam: Exam;
}

export function ExamHeader({ exam }: ExamHeaderProps) {
  // Format exam data for display
  const examTypeColor = 
    exam.type === ExamType.PRELIMS ? "bg-blue-100 text-blue-800" :
    exam.type === ExamType.MAINS ? "bg-purple-100 text-purple-800" :
    "bg-gray-100 text-gray-800";

  const testTypeColor = 
    exam.testType === TestType.FULL_LENGTH ? "bg-green-100 text-green-800" :
    exam.testType === TestType.SECTIONAL ? "bg-yellow-100 text-yellow-800" :
    "bg-gray-100 text-gray-800";

  const formattedDuration = () => {
    const hours = Math.floor(exam.duration / 60);
    const minutes = exam.duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={examTypeColor}>{exam.type}</Badge>
            <Badge className={testTypeColor}>{exam.testType}</Badge>
            {exam.subject && <Badge variant="outline">{exam.subject}</Badge>}
            {exam.isFree ? (
              <Badge variant="outline" className="bg-green-50 text-green-700">Free</Badge>
            ) : (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                ₹{(exam.cost / 100).toFixed(2)}
              </Badge>
            )}
            {!exam.isActive && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/exams/${exam.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="bg-primary/10 p-2 rounded-full">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{formattedDuration()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="bg-primary/10 p-2 rounded-full">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Marks</p>
            <p className="font-medium">{exam.totalMarks}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="bg-primary/10 p-2 rounded-full">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-medium">{format(new Date(exam.createdAt), 'MMM d, yyyy')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teacher</p>
            <p className="font-medium">{exam.teacher?.name || "Unknown"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
