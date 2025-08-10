import type { AxiosPromise, AxiosRequestConfig } from 'axios';

import type { ApiResponse } from '~/types';

import { httpBase } from '~/services/config.service';

export interface TrackBehaviorRequest {
  productId: string;
  actionType: 'VIEW' | 'LINGER' | 'ADD_TO_CART' | 'PURCHASE' | 'ADD_TO_WISHLIST';
  duration?: number;
  source?: 'product_card' | 'product_detail' | 'checkout';
}

export interface BehaviorTrackingResponse {
  id: string;
  customerProfileId: string;
  productId: string;
  actionType: string;
  score: number;
  duration?: number;
  source?: string;
  createdAt: string;
  isNewRecord: boolean;
}

export const behaviorApi = {
  /**
   * Track customer behavior
   */
  track({ data, config }: { data: TrackBehaviorRequest; config?: AxiosRequestConfig }): AxiosPromise<ApiResponse<BehaviorTrackingResponse>> {
    return httpBase.post<TrackBehaviorRequest, ApiResponse<BehaviorTrackingResponse>>('/api/user-behavior/track', data, config);
  }
};
