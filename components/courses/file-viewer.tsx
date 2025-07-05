"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Image, FileArchive, File, ExternalLink } from 'lucide-react';

interface FileViewerProps {
  url: string;
  fileName?: string;
  index?: number;
}

export function FileViewer({ url, fileName, index = 0 }: FileViewerProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Get file extension from URL
  const getFileExtension = (url: string): string => {
    const urlParts = url.split('?')[0]; // Remove query parameters
    const pathParts = urlParts.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };
  
  // Get display name for the file
  const getDisplayName = (): string => {
    if (fileName) return fileName;
    
    const urlParts = url.split('/');
    const fileNameWithParams = urlParts[urlParts.length - 1];
    const fileNameOnly = fileNameWithParams.split('?')[0];
    
    return fileNameOnly || `File ${index + 1}`;
  };
  
  const extension = getFileExtension(url);
  const displayName = getDisplayName();
  
  // Render appropriate icon based on file type
  const renderFileIcon = () => {
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 mr-2" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return <Image className="h-6 w-6 mr-2" />;
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return <FileArchive className="h-6 w-6 mr-2" />;
      default:
        return <File className="h-6 w-6 mr-2" />;
    }
  };
  
  // Render file content based on type
  const renderFileContent = () => {
    if (!expanded) return null;
    
    switch (extension) {
      case 'pdf':
        return (
          <div className="mt-4 aspect-video">
            <iframe 
              src={`${url}#toolbar=0`} 
              className="w-full h-[500px] border-0"
              title={displayName}
            />
          </div>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return (
          <div className="mt-4 flex justify-center">
            <img 
              src={url} 
              alt={displayName} 
              className="max-h-[500px] object-contain"
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center overflow-hidden">
            {renderFileIcon()}
            <span className="truncate">{displayName}</span>
          </div>
          <div className="flex gap-2">
            {(extension === 'pdf' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Hide' : 'View'}
              </Button>
            )}
            <Button asChild size="sm">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </a>
            </Button>
          </div>
        </div>
        {renderFileContent()}
      </CardContent>
    </Card>
  );
}
