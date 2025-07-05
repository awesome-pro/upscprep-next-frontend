"use client";

import { useState } from "react";
import { Control } from "react-hook-form";
import { ExamFormValues } from "./exam-form-schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Upload, File, Trash2 } from "lucide-react";

interface FileAndTagsFieldsProps {
  control: Control<ExamFormValues>;
  existingFiles?: string[];
  onFileChange: (files: FileList | null) => void;
  onRemoveExistingFile?: (fileUrl: string) => void;
}

export function FileAndTagsFields({ 
  control, 
  existingFiles = [], 
  onFileChange,
  onRemoveExistingFile 
}: FileAndTagsFieldsProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
      onFileChange(files);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    // Note: This doesn't actually remove the file from the form data
    // That would need to be handled in the parent component
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Exam Files</FormLabel>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            id="examFiles"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("examFiles")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
        <FormDescription>
          Upload PDF files, question papers, or any other relevant documents.
        </FormDescription>
        
        {/* Display existing files */}
        {existingFiles.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">Current Files:</p>
            <div className="space-y-2">
              {existingFiles.map((fileUrl, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">
                      {fileUrl.split('/').pop()}
                    </span>
                  </div>
                  {onRemoveExistingFile && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveExistingFile(fileUrl)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">Selected Files:</p>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeSelectedFile(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </FormItem>

     
    </div>
  );
}
