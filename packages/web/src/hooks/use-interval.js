import { useEffect, useRef } from '../lib/index.js';

/**
 * Invoke the callback functino at an interval
 * @param {() => any} callback
 * @param {number | null} interval in ms, when set to null, callback won't be executed
 */
export function useInterval(callback, interval) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (!savedCallback.current) return;

      savedCallback.current();
    }
    if (interval !== null) {
      let id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
  }, [interval]);
}
