/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation } from '@tanstack/react-query';

import type { ApiResponse } from '~/types';

import { behaviorApi, type BehaviorTrackingResponse, type TrackBehaviorRequest } from '~/services/behavior.api';

/**
 * Hook for tracking customer behavior
 */
export function useTrackBehavior() {
  return useMutation<ApiResponse<BehaviorTrackingResponse>, Error, TrackBehaviorRequest>({
    mutationFn: (data: TrackBehaviorRequest) => {
      return behaviorApi.track({ data }).then((response) => response.data);
    },
    onSuccess: (response) => {
      if (response.result?.isNewRecord) {
        console.log('✅ Behavior tracked:', response.result.actionType, 'for product:', response.result.productId);
      } else {
        console.log('🔄 Duplicate behavior detected for product:', response.result?.productId);
      }
    },
    onError: (error) => {
      console.warn('⚠️ Failed to track behavior:', error.message);
    }
  });
}
