"use client";

import { AnswerKey } from "@/types/exams";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface AnswerKeyListProps {
  answerKeys: AnswerKey[];
  examId: string;
}

export function AnswerKeyList({ answerKeys, examId }: AnswerKeyListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Answer Keys</CardTitle>
          <CardDescription>
            Official and unofficial answer keys for this exam
          </CardDescription>
        </div>
        <Button asChild>
          <Link href={`/dashboard/exams/${examId}/answer-keys/create`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Answer Key
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {answerKeys.length > 0 ? (
          <div className="space-y-4">
            {answerKeys.map((key) => (
              <div 
                key={key.id} 
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Version: {key.version}</span>
                      {key.isOfficial ? (
                        <Badge className="bg-green-100 text-green-800">Official</Badge>
                      ) : (
                        <Badge variant="outline">Unofficial</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created {format(new Date(key.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/dashboard/exams/${examId}/answer-keys/${key.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No answer keys available for this exam</p>
            <Button className="mt-4" asChild>
              <Link href={`/dashboard/exams/${examId}/answer-keys/create`}>
                Create Answer Key
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
