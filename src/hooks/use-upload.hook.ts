import type { AxiosRequestConfig } from 'axios';

import { generalApi } from '~/services';

type UploadParams = {
  data: {
    file: File;
    fileType?: string;
  };
  configGetPreSignLink?: AxiosRequestConfig;
  configUploadFile?: AxiosRequestConfig;
  onSuccessGetPreSignLink?: () => void;
  onSuccessUploadFile?: () => void;
};
type UseUploadResponse = {
  upload: (params: UploadParams) => Promise<{
    url: string;
    key: string;
  }>;
};

export function useUpload(): UseUploadResponse {
  const upload = async ({
    data: { file, fileType },
    configGetPreSignLink,
    configUploadFile,
    onSuccessGetPreSignLink,
    onSuccessUploadFile
  }: UploadParams): Promise<{
    url: string;
    key: string;
  }> => {
    try {
      const {
        data: { url, key }
      } = await generalApi.getPreSignLink({
        data: {
          fileName: file.name,
          fileType: fileType ?? file.type
        },
        config: configGetPreSignLink
      });
      onSuccessGetPreSignLink && onSuccessGetPreSignLink();

      try {
        await generalApi.uploadFile({ data: { file, url }, config: configUploadFile });
        onSuccessUploadFile && onSuccessUploadFile();

        return {
          url,
          key
        };
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  return { upload };
}
