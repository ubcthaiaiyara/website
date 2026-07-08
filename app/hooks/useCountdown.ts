import { useCallback, useEffect, useState } from "react";

/**
 * Whole-second countdown for resend cooldowns. Call `start(seconds)` to (re)begin;
 * `remaining` ticks down to 0. Driven off a target timestamp so it self-corrects
 * if timers are throttled (e.g. a backgrounded tab).
 */
export function useCountdown(): [number, (seconds: number) => void] {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  const start = useCallback((seconds: number) => {
    setEndAt(Date.now() + seconds * 1000);
    setRemaining(seconds);
  }, []);

  useEffect(() => {
    if (endAt === null) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) setEndAt(null);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endAt]);

  return [remaining, start];
}

/**
 * Pull the wait time out of a rate-limit message like "Please wait 3 seconds
 * before requesting a new code." Returns null if there's no number to show.
 */
export function parseWaitSeconds(message?: string): number | null {
  const match = /(\d+)\s*seconds?/i.exec(message ?? "");
  return match ? Number(match[1]) : null;
}
