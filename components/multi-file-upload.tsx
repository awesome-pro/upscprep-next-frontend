"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useDirectUpload } from "@/hooks/use-direct-upload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, CheckCircle2, AlertCircle, Loader2, FileText, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileUploadState {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

interface MultiFileUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  initialUrls?: string[];
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxSizeInMB?: number;
  prefix?: string;
  className?: string;
  disabled?: boolean;
}

// File type detection utilities
const getFileExtension = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.split('.').pop()?.toLowerCase() || '';
    return extension;
  } catch {
    // If URL parsing fails, try to extract from string
    return url.split('.').pop()?.toLowerCase() || '';
  }
};

const getFileType = (url: string): 'image' | 'pdf' | 'document' | 'other' => {
  const extension = getFileExtension(url);
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
    return 'image';
  }
  if (extension === 'pdf') {
    return 'pdf';
  }
  if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
    return 'document';
  }
  return 'other';
};

const getFileName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split('/').pop() || 'Unknown file';
  } catch {
    return url.split('/').pop() || 'Unknown file';
  }
};

// File preview component
const FilePreview = ({ 
  url, 
  index, 
  onRemove, 
  disabled 
}: { 
  url: string; 
  index: number; 
  onRemove: () => void; 
  disabled: boolean; 
}) => {
  const fileType = getFileType(url);
  const fileName = getFileName(url);
  const extension = getFileExtension(url).toUpperCase();

  const handlePreview = () => {
    window.open(url, '_blank');
  };

  // Image preview (existing functionality)
  if (fileType === 'image') {
    return (
      <div className="relative group aspect-square rounded-md overflow-hidden border border-border bg-muted">
        <Image 
          src={url} 
          alt={`Uploaded file ${index + 1}`}
          fill
          className="object-cover"
          onError={() => {
            // Fallback if image fails to load
            console.error('Failed to load image:', url);
          }}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handlePreview}
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          onClick={onRemove}
          disabled={disabled}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // Non-image file preview
  return (
    <div className="relative group aspect-square rounded-md border border-border bg-muted/50 flex flex-col items-center justify-center p-3 hover:bg-muted/70 transition-colors">
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        
        <div className="space-y-1 w-full">
          <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {extension || 'FILE'}
          </div>
          <p className="text-xs text-muted-foreground truncate w-full px-1" title={fileName}>
            {fileName}
          </p>
        </div>
      </div>
      
      {/* Action buttons overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handlePreview}
          className="text-xs h-7"
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="text-xs h-7"
        >
          <Download className="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>
      
      {/* Remove button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
        onClick={onRemove}
        disabled={disabled}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Extract S3 URL from presigned URL
const extractS3Url = (presignedUrl: string): string => {
  try {
    // Parse the URL
    const url = new URL(presignedUrl);
    // Get the pathname (e.g., /bucket-name/path/to/file.ext)
    const pathname = url.pathname;
    // Construct the direct S3 URL
    return `https://${url.hostname}${pathname}`;
  } catch (error) {
    console.error('Error extracting S3 URL:', error);
    return presignedUrl; // Return original URL if parsing fails
  }
};

export function MultiFileUpload({
  onUploadComplete,
  initialUrls = [],
  maxFiles = 5,
  acceptedFileTypes = ["image/*", "application/pdf"],
  maxSizeInMB = 5,
  prefix = "modules/",
  className,
  disabled = false,
}: MultiFileUploadProps) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls);
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadSingleFile, cancelUpload } = useDirectUpload();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setError(null);
    
    // Check if adding these files would exceed the max files limit
    if (uploadedUrls.length + e.target.files.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} files`);
      return;
    }
    
    const newUploadingFiles: FileUploadState[] = [];
    
    // Process each file
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`File ${file.name} exceeds the maximum size of ${maxSizeInMB}MB`);
        continue;
      }
      
      // Check file type if specified
      if (acceptedFileTypes && !acceptedFileTypes.some(type => file.type.match(type))) {
        setError(`File ${file.name} is not an accepted file type`);
        continue;
      }
      
      // Create a unique ID for this file
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${i}`;
      
      // Add to uploading files state
      newUploadingFiles.push({
        id: fileId,
        file,
        progress: 0,
        status: "pending"
      });
    }
    
    if (newUploadingFiles.length === 0) {
      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    // Add new files to state
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    
    // Upload each file
    for (const fileState of newUploadingFiles) {
      try {
        // Update status to uploading
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileState.id ? { ...f, status: "uploading" } : f)
        );
        
        // Upload the file
        const result = await uploadSingleFile(fileState.file, fileState.id, {
          prefix,
          onProgress: (percent) => {
            setUploadingFiles(prev => 
              prev.map(f => f.id === fileState.id ? { ...f, progress: percent } : f)
            );
          }
        });
        
        if (result.success && result.url) {
          // Extract the S3 URL
          const s3Url = extractS3Url(result.url);
          
          // Update file status to success
          setUploadingFiles(prev => 
            prev.map(f => f.id === fileState.id ? { 
              ...f, 
              status: "success", 
              url: s3Url,
              progress: 100 
            } : f)
          );
          
          // Add to uploaded URLs
          setUploadedUrls(prev => {
            const newUrls = [...prev, s3Url];
            // Call the callback with updated URLs
            onUploadComplete?.(newUrls);
            return newUrls;
          });
        } else {
          throw new Error("Upload failed");
        }
      } catch (err) {
        console.error(`Upload error for ${fileState.file.name}:`, err);
        
        // Update file status to error
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileState.id ? { 
            ...f, 
            status: "error", 
            error: err instanceof Error ? err.message : "Upload failed",
            progress: 0
          } : f)
        );
      }
    }
    
    // Reset the file input
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    // After a delay, remove successful uploads from the uploading files list
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.status !== "success"));
    }, 1500);
  };

  const removeUploadedFile = (urlToRemove: string) => {
    const newUrls = uploadedUrls.filter(url => url !== urlToRemove);
    setUploadedUrls(newUrls);
    onUploadComplete?.(newUrls);
  };

  const removeUploadingFile = (fileId: string) => {
    // Cancel the upload if it's in progress
    const fileToRemove = uploadingFiles.find(f => f.id === fileId);
    if (fileToRemove && fileToRemove.status === "uploading") {
      cancelUpload(fileId);
    }
    
    // Remove from state
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Uploaded Files Preview */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <FilePreview
              key={`${url}-${index}`}
              url={url}
              index={index}
              onRemove={() => removeUploadedFile(url)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
      
      {/* Files in progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((fileState) => (
            <div key={fileState.id} className="flex items-center gap-2 p-2 border rounded-md">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium truncate">{fileState.file.name}</span>
                  <span className="text-xs text-muted-foreground">{Math.round(fileState.progress)}%</span>
                </div>
                <Progress value={fileState.progress} className="h-2" />
                {fileState.error && (
                  <p className="text-xs text-destructive mt-1">{fileState.error}</p>
                )}
              </div>
              <div className="flex-shrink-0 w-6">
                {fileState.status === "error" && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                {fileState.status === "success" && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {(fileState.status === "uploading" || fileState.status === "pending") && (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeUploadingFile(fileState.id)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload button */}
      {uploadedUrls.length < maxFiles && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
          
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes.join(",")}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || uploadedUrls.length >= maxFiles}
          />
          
          <p className="text-xs text-muted-foreground mt-2">
            Upload up to {maxFiles} files. Max {maxSizeInMB}MB per file.
          </p>
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm mt-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}