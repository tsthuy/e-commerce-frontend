import { useCallback, useEffect, useRef } from 'react';

import type { AnyType } from '~/types';

const DEFAULT_THROTTLE_MS = 300;

const getRemainingTime = (lastTriggeredTime: number, throttleMs: number): number => {
  const elapsedTime = Date.now() - lastTriggeredTime;
  const remainingTime = throttleMs - elapsedTime;

  return remainingTime < 0 ? 0 : remainingTime;
};

export const useThrottledFunction = (callbackFn: (args?: AnyType) => AnyType, throttleMs: number = DEFAULT_THROTTLE_MS): (<T>(args?: T) => void) => {
  const lastTriggered = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const throttledFn = useCallback(
    <T>(args?: T) => {
      let remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

      if (remainingTime === 0) {
        lastTriggered.current = Date.now();
        callbackFn(args);
        cancel();
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

          if (remainingTime === 0) {
            lastTriggered.current = Date.now();
            callbackFn(args);
            cancel();
          }
        }, remainingTime);
      }
    },
    [callbackFn, cancel]
  );

  useEffect(() => cancel, [cancel]);

  return throttledFn;
};
