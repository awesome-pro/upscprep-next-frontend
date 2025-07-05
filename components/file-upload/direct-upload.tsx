'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useDirectUpload } from '@/hooks/use-direct-upload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  prefix?: string;
  className?: string;
  buttonText?: string;
}

export function DirectFileUpload({
  onUploadComplete,
  accept = '*/*',
  maxSize = 100 * 1024 * 1024, // 100MB default
  prefix = '',
  className,
  buttonText = 'Upload File'
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadSingleFile: uploadFile, cancelUpload } = useDirectUpload();

  const handleFileChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds the maximum allowed size (${Math.round(maxSize / (1024 * 1024))}MB)`);
      return;
    }
    
    setError(null);
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Generate a unique file ID
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const result = await uploadFile(file, fileId, {
        prefix,
        onProgress: (percent) => {
          setProgress(percent);
        }
      });
      
      if (result.success && result.url) {
        onUploadComplete(result.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    // cancelUpload(fileId);
    setIsUploading(false);
    setProgress(0);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {!isUploading && <Upload className="mr-2 h-4 w-4" />}
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
        
        {isUploading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-destructive"
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{Math.round(progress)}% uploaded</p>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
