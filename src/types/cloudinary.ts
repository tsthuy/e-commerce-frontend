export type CloudinaryUploadParams = {
  file: File;
  onProgress?: (progress: number) => void;
};

export type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
};

export type CloudinaryMultipleUploadParams = {
  files: File[];
  onProgress?: (progress: number, index: number) => void;
  onFileComplete?: (response: CloudinaryUploadResponse, index: number) => void;
};

export type CloudinaryConfig = {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
};
