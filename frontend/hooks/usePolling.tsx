import { useEffect, useRef } from "react";

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
}

export function usePolling(callback: () => void | Promise<void>, options: UsePollingOptions = {}) {
  const { interval = 30000, enabled = true } = options;
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
}
