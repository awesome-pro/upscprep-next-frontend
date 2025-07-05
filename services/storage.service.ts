import api from '@/lib/axios';

export interface PresignedUrlDto {
  key: string;
  contentType: string;
  prefix?: string;
  expiresIn?: number;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
  fields?: Record<string, string>;
}

export interface ConfirmUploadDto {
  key: string;
  etag?: string;
}

export interface FileInfo {
  key: string;
  size: number;
  etag: string;
  contentType: string;
  url: string;
  metadata?: Record<string, string>;
}

export interface ConfirmUploadResponse {
  success: boolean;
  error?: string;
  fileInfo?: FileInfo;
}

export const storageService = {
  /**
   * Get a presigned URL for direct upload to S3
   */
  async getPresignedUploadUrl(data: PresignedUrlDto): Promise<PresignedUrlResponse> {
    return await api.post('/storage/presigned-url', data).then((response) => response.data);
  },

  /**
   * Confirm a file upload after direct upload to S3
   */
  async confirmFileUpload(data: ConfirmUploadDto): Promise<ConfirmUploadResponse> {
    return await api.post('/storage/confirm-upload', data).then((response) => response.data);
  },

  /**
   * Get a presigned URL for downloading a file
   */
  async getDownloadUrl(key: string, expiresIn?: number): Promise<{ url: string }> {
    const params = expiresIn ? `?expiresIn=${expiresIn}` : '';
    return await api.get(`/storage/download/${key}${params}`).then((response) => response.data);
  },

  /**
   * Check if a file exists in S3
   */
  async fileExists(key: string): Promise<{ exists: boolean }> {
    return await api.post('/storage/exists', { key }).then((response) => response.data);
  },

  /**
   * Get metadata for a file in S3
   */
  async getFileMetadata(key: string): Promise<Record<string, any>> {
    return await api.get(`/storage/metadata/${key}`).then((response) => response.data);
  },

  /**
   * List files in S3 with optional prefix
   */
  async listFiles(prefix?: string, maxKeys?: number): Promise<{ files: any[] }> {
    const params = new URLSearchParams();
    if (prefix) params.append('prefix', prefix);
    if (maxKeys) params.append('maxKeys', maxKeys.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/storage/list${queryString}`).then((response) => response.data);
  },
};
