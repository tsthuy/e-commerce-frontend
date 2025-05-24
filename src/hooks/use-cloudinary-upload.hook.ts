import { useState } from 'react';

import { toast } from 'sonner';

import { cloudinaryService } from '~/services/cloudinary.service';
import type { CloudinaryUploadResponse } from '~/types/cloudinary';

interface UseCloudinaryUploadOptions {
  folder?: string;
}

export interface UseCloudinaryUploadReturn {
  uploadFile: (file: File) => Promise<CloudinaryUploadResponse>;

  uploadFiles: (files: File[]) => Promise<CloudinaryUploadResponse[]>;

  resetUpload: () => void;

  isUploading: boolean;

  progress: { [fileName: string]: number };

  uploadedFiles: CloudinaryUploadResponse[];
}

export function useCloudinaryUpload(options?: UseCloudinaryUploadOptions): UseCloudinaryUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<CloudinaryUploadResponse[]>([]);

  if (options?.folder) {
    cloudinaryService.setUploadFolder(options.folder);
  }

  /**
   * Upload a single file
   */
  const uploadFile = async (file: File): Promise<CloudinaryUploadResponse> => {
    setIsUploading(true);
    setProgress({ [file.name]: 0 });

    try {
      const response = await cloudinaryService.uploadImage({
        file,
        onProgress: (p) => {
          setProgress((prev) => ({ ...prev, [file.name]: p }));
        }
      });

      setUploadedFiles((prev) => [...prev, response]);
      // toast.success(`${file.name} uploaded successfully`);
      return response;
    } catch (error) {
      toast.error(`Failed to upload ${file.name}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Upload multiple files
   */
  const uploadFiles = async (files: File[]): Promise<CloudinaryUploadResponse[]> => {
    if (!files.length) return [];

    setIsUploading(true);
    // Initialize progress for each file
    const initialProgress = files.reduce(
      (acc, file) => {
        acc[file.name] = 0;
        return acc;
      },
      {} as { [key: string]: number }
    );

    setProgress(initialProgress);

    try {
      const responses = await cloudinaryService.uploadMultipleImages({
        files,
        onProgress: (p, index) => {
          const fileName = files[index].name;
          setProgress((prev) => ({ ...prev, [fileName]: p }));
        },
        onFileComplete: (response) => {
          setUploadedFiles((prev) => [...prev, response]);
        }
      });

      // toast.success(`${files.length} files uploaded successfully`);
      return responses;
    } catch (error) {
      toast.error('Some files failed to upload');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset upload state
   */
  const resetUpload = (): void => {
    setUploadedFiles([]);
    setProgress({});
  };

  return {
    uploadFile,
    uploadFiles,
    resetUpload,
    isUploading,
    progress,
    uploadedFiles
  };
}
