import { useEffect } from 'react';

import type { AnyType, RefType } from '~/types';

/**
 * A custom hook that executes a handler function when a click occurs outside of a specified element.
 *
 * @param {RefType<AnyType>} ref - A React ref object pointing to the element to monitor for outside clicks.
 * @param {(event: AnyType) => void} handler - A function to call when a click is detected outside the referenced element.
 *
 * @example
 * const MyComponent = () => {
 *   const ref = useRef(null);
 *
 *   const handleClickOutside = (event) => {
 *     log('Clicked outside!', event);
 *   };
 *
 *   useClickOutside(ref, handleClickOutside);
 *
 *   return <div ref={ref}>Click outside this element</div>;
 * };
 */

export function useClickOutside(ref: RefType<AnyType>, handler: (event: AnyType) => void): void {
  useEffect(() => {
    const listener = (event: AnyType): void => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return (): void => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
