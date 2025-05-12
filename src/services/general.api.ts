import type { AxiosPromise, AxiosResponse } from 'axios';
import axios from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, GetSignedUrlBody, GetSignedUrlResponse, UploadFileParams } from '~/types';

import { httpBase } from '~/services';

import { getMimeType } from '~/utils';

export const generalApi = {
  getPreSignLink({ data, config }: ApiParams<GetSignedUrlBody>): AxiosPromise<GetSignedUrlResponse> {
    return httpBase.post<GetSignedUrlBody, GetSignedUrlResponse>(API_URLS.general.upload.single.getPreSignLink, data, config);
  },
  uploadFile({ data: { url, file }, config }: ApiParams<UploadFileParams>): Promise<AxiosResponse> {
    return axios.put(url, file, {
      ...config,
      headers: {
        'Content-Type': getMimeType(file)
      }
    });
  }
};
