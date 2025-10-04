export type GetSignedUrlBody = {
  fileName: string;
  fileType?: string;
  objectType?: string;
};
export type GetSignedUrlResponse = {
  key: string;
  url: string;
};

export type UploadFileParams = {
  url: string;
  file: File;
};
