"use client";

import { Difficulty, Exam } from "@/types/exams";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tag, CheckCircle, XCircle, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FileViewer } from "@/components/courses/file-viewer";

interface ExamDetailsProps {
  exam: Exam;
}

export function ExamDetails({ exam }: ExamDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Details</CardTitle>
        <CardDescription>
          Complete information about this exam
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">
            {exam.description || "No description provided"}
          </p>
        </div>
        
        <Separator />
        
        {/* Marking Scheme */}
        <div>
          <h3 className="font-medium mb-2">Marking Scheme</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Correct Answer</p>
                <p className="font-medium">+{exam.correctMark || 0} marks</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Incorrect Answer</p>
                <p className="font-medium">{exam.incorrectMark || 0} marks</p>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant={exam.negativeMarking ? "default" : "outline"}>
              {exam.negativeMarking ? "Negative Marking Enabled" : "No Negative Marking"}
            </Badge>
          </div>
        </div>
        
        <Separator />
        
        {/* Tags */}
        {exam.tags && exam.tags.length > 0 && (
          <>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {exam.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}
        
        {/* Difficulty */}
        {exam.difficulty && (
          <>
            <div>
              <h3 className="font-medium mb-2">Difficulty</h3>
              <Badge 
                variant="outline" 
                className={
                  exam.difficulty === Difficulty.EASY ? "bg-green-50 text-green-700" :
                  exam.difficulty === Difficulty.MEDIUM ? "bg-yellow-50 text-yellow-700" :
                  "bg-red-50 text-red-700"
                }
              >
                {exam.difficulty}
              </Badge>
            </div>
            <Separator />
          </>
        )}
        
        {/* Exam Files */}
        <div>
          <h3 className="font-medium mb-2">Exam Files</h3>
          {
            exam.fileUrls && exam.fileUrls.length > 0 && exam.fileUrls.map((url, index) => (
              <FileViewer url={url} key={`file-${index}`} index={index} />
            ))
          }
        </div>
        
        {/* Test Series Info */}
        {exam.testSeriesId && exam.testSeries && (
          <>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Test Series</h3>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="font-medium">{exam.testSeries.title}</p>
                <p className="text-sm text-muted-foreground">
                  {exam.testSeries.description || "No description"}
                </p>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1" asChild>
                  <Link href={`/dashboard/test-series/${exam.testSeriesId}`}>
                    View Test Series
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
