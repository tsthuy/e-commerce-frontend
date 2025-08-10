/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useCallback, useRef } from 'react';

import { useTrackBehavior } from './use-behavior-tracking.hook';

import type { TrackBehaviorRequest } from '~/services/behavior.api';

/**
 * Stable behavior tracking hook to prevent dependency loops
 */
export function useStableBehaviorTracking() {
  const trackBehavior = useTrackBehavior();
  const trackedProductsRef = useRef<Set<string>>(new Set());

  const trackBehaviorStable = useCallback(
    (request: TrackBehaviorRequest) => {
      const key = `${request.productId}-${request.actionType}`;
      if (request.actionType === 'VIEW' && trackedProductsRef.current.has(key)) {
        return;
      }

      trackBehavior.mutate(request);

      if (request.actionType === 'VIEW') {
        trackedProductsRef.current.add(key);
      }
    },
    [trackBehavior]
  );

  const clearTrackedProducts = useCallback(() => {
    trackedProductsRef.current.clear();
  }, []);

  return {
    trackBehavior: trackBehaviorStable,
    clearTrackedProducts,
    isTracking: trackBehavior.isPending
  };
}
