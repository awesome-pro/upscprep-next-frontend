"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Exam, ExamQueryParams } from "@/types/exams";
import api from "@/lib/axios";
import { ExamService } from "@/services";

interface ExamSelectorProps {
  selectedExamIds: string[];
  onChange: (examIds: string[]) => void;
  disabled?: boolean;
}

export function ExamSelector({ selectedExamIds, onChange, disabled = false }: ExamSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExams, setSelectedExams] = useState<Exam[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch exams based on search query with debounce
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      if (open) {
        setLoading(true);
        try {
          const params: ExamQueryParams = {
            search: searchQuery,
            isActive: true,
            pageSize: 20,
            page: 1,
          };

          const response = await ExamService.getExams(params);
          setExams(response.data);
        } catch (error) {
          console.error("Error fetching exams:", error);
        } finally {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, open]);

  // Fetch selected exams when component mounts or selectedExamIds changes
  useEffect(() => {
    const fetchSelectedExams = async () => {
      if (selectedExamIds.length === 0) {
        setSelectedExams([]);
        return;
      }

      try {
        const promises = selectedExamIds.map(id => 
          ExamService.getExamById(id)
        );
        const examData = await Promise.all(promises);
        setSelectedExams(examData);
      } catch (error) {
        console.error("Error fetching selected exams:", error);
      }
    };

    fetchSelectedExams();
  }, [selectedExamIds]);

  const handleSelect = (examId: string) => {
    const isSelected = selectedExamIds.includes(examId);
    let newSelectedIds: string[];

    if (isSelected) {
      newSelectedIds = selectedExamIds.filter(id => id !== examId);
    } else {
      newSelectedIds = [...selectedExamIds, examId];
    }

    onChange(newSelectedIds);
  };

  const removeExam = (examId: string) => {
    onChange(selectedExamIds.filter(id => id !== examId));
  };

  return (
    <div className="space-y-4 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            type="button"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            Select exams
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] lg:w-[500px] h-[300px] p-0" align="center">
          <Command>
            <CommandInput 
              placeholder="Search exams..."  
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            {loading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Loading exams...</p>
              </div>
            ) : (
              <>
                <CommandEmpty>No exams found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {exams.map((exam) => (
                      <CommandItem
                        key={exam.id}
                        value={exam.id}
                        onSelect={() => handleSelect(exam.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedExamIds.includes(exam.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{exam.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {exam.type} - {exam.subject || "General"}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {selectedExams.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedExams.map((exam) => (
            <Badge key={exam.id} variant="secondary" className="flex items-center gap-1">
              {exam.title}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeExam(exam.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
