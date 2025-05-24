import axios from 'axios';
import { toast } from 'sonner';

import { CLOUDINARY_CONFIG } from '~/constants';

import type { CloudinaryConfig, CloudinaryMultipleUploadParams, CloudinaryUploadParams, CloudinaryUploadResponse } from '~/types';

import { getErrorMessage } from '~/utils';

class CloudinaryService {
  private config: CloudinaryConfig;

  public constructor(config: CloudinaryConfig = CLOUDINARY_CONFIG) {
    this.config = config;
  }

  private getUploadUrl(): string {
    return `${CLOUDINARY_CONFIG.apiUrl}${this.config.cloudName}/image/upload`;
  }

  /**
   * Upload a single image to Cloudinary
   */
  public async uploadImage({ file, onProgress }: CloudinaryUploadParams): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', this.config.uploadPreset);

    if (this.config.folder) {
      formData.append('folder', this.config.folder);
    }

    try {
      const response = await axios.post<CloudinaryUploadResponse>(this.getUploadUrl(), formData, {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      });

      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  public async uploadMultipleImages({ files, onProgress, onFileComplete }: CloudinaryMultipleUploadParams): Promise<CloudinaryUploadResponse[]> {
    try {
      const uploadPromises = files.map((file, index) =>
        this.uploadImage({
          file,
          onProgress: (progress) => onProgress?.(progress, index)
        }).then((response) => {
          onFileComplete?.(response, index);
          return response;
        })
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw new Error('Failed to upload one or more images. Please try again.');
    }
  }

  /**
   * Upload multiple images with sequential processing and better error handling
   */
  public async uploadMultipleImagesSequential({ files, onProgress, onFileComplete }: CloudinaryMultipleUploadParams): Promise<CloudinaryUploadResponse[]> {
    const results: CloudinaryUploadResponse[] = [];
    const errors: { file: string; error: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await this.uploadImage({
          file,
          onProgress: (progress) => onProgress?.(progress, i)
        });

        results.push(response);
        onFileComplete?.(response, i);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        errors.push({ file: file.name, error: 'Upload failed' });
      }
    }

    if (errors.length > 0) {
      const errorFiles = errors.map((e) => e.file).join(', ');
      toast.error(`Failed to upload: ${errorFiles}`);
    }

    return results;
  }

  /**
   * Set the active folder for uploads
   */
  public setUploadFolder(folder: string): void {
    this.config.folder = folder;
  }

  /**
   * Generate a Cloudinary URL with transformations
   */
  public static getImageUrl(publicId: string, options?: Record<string, string | number>): string {
    if (!publicId) return '';

    const cloudName = CLOUDINARY_CONFIG.cloudName;
    let transformations = 'q_auto,f_auto';

    if (options) {
      const transformArray = Object.entries(options).map(([key, value]) => `${key}_${value}`);
      transformations = transformArray.join(',');
    }

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  }
}

export const cloudinaryService = new CloudinaryService();

export { CloudinaryService };
