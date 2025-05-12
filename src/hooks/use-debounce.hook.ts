import { useEffect, useState } from 'react';

/**
 * A custom hook that debounces a value.
 *
 * @param {T} value - The value to be debounced.
 * @param {number} [delay=500] - The debounce delay in milliseconds (default is 500ms).
 * @returns {T} - The debounced value.
 *
 * @example
 * const MyComponent = () => {
 *   const [inputValue, setInputValue] = useState('');
 *   const debouncedValue = useDebounce(inputValue, 300);
 *
 *   useEffect(() => {
 *     // Call an API or perform some action with the debounced value
 *     log(debouncedValue);
 *   }, [debouncedValue]);
 *
 *   return (
 *     <input
 *       type="text"
 *       value={inputValue}
 *       onChange={(e) => setInputValue(e.target.value)}
 *     />
 *   );
 * };
 */

export function useDebounce<T>(value: T, delay?: number): T {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay ?? 500);

    return (): void => clearTimeout(timer);
  }, [value, delay]);

  return debounceValue;
}
