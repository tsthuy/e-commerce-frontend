import { useEffect, useState } from 'react';

type WindowSizeType = { width: number; height: number };

type UseWindowResizeType = {
  debounce?: {
    callback: () => void;
    ms: number;
  };
};

/**
 * A custom hook that tracks the window size and provides an optional debounce feature for resize events.
 *
 * @param {UseWindowResizeType} [props] - Optional configuration for debounce.
 * @param {Object} [props.debounce] - Debounce configuration.
 * @param {() => void} props.debounce.callback - The callback function to be executed after the debounce delay.
 * @param {number} props.debounce.ms - The debounce delay in milliseconds.
 * @returns {WindowSizeType} - An object containing the current window width and height.
 *
 * @example
 * const MyComponent = () => {
 *   const { width, height } = useWindowResize({
 *     debounce: {
 *       callback: () => {
 *         log('Resized to:', width, height);
 *       },
 *       ms: 300
 *     }
 *   });
 *
 *   return (
 *     <div>
 *       <p>Width: {width}</p>
 *       <p>Height: {height}</p>
 *     </div>
 *   );
 * };
 */

export function useWindowResize(props?: UseWindowResizeType): WindowSizeType {
  const [windowSize, setWindowSize] = useState<WindowSizeType>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      if (!!props?.debounce) {
        const { callback, ms } = props.debounce;

        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(callback, ms);
      }
    };

    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('resize', handleResize);
      if (!!props?.debounce) clearTimeout(resizeTimeout);
    };
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height
  };
}
