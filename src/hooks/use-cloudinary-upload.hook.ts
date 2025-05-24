import { useState } from 'react';

import { toast } from 'sonner';

import { getErrorMessage } from '~/utils';

import { cloudinaryService } from '~/services/cloudinary.service';
import type { CloudinaryUploadResponse } from '~/types/cloudinary';

interface UseCloudinaryUploadOptions {
  folder?: string;
}

export interface UseCloudinaryUploadReturn {
  uploadFile: (file: File) => Promise<CloudinaryUploadResponse>;
  uploadFiles: (files: File[]) => Promise<CloudinaryUploadResponse[]>;

  deleteUploadedImage: (publicId: string) => Promise<boolean>;
  deleteUploadedImages: (publicIds: string[]) => Promise<boolean[]>;

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

  /**
   * Delete a image uploaded
   */
  const deleteUploadedImage = async (publicId: string): Promise<boolean> => {
    if (!publicId) return false;

    try {
      return await cloudinaryService.deleteImage(publicId);
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  /**
   * Delete images uploaded
   */
  const deleteUploadedImages = async (publicIds: string[]): Promise<boolean[]> => {
    if (!publicIds?.length) return [];

    try {
      return await cloudinaryService.deleteMultipleImages(publicIds);
    } catch (error) {
      toast.error(getErrorMessage(error));
      return publicIds.map(() => false);
    }
  };

  return {
    uploadFile,
    uploadFiles,
    resetUpload,
    deleteUploadedImage,
    deleteUploadedImages,
    isUploading,
    progress,
    uploadedFiles
  };
}
