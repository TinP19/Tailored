import { useState, useEffect } from 'react';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(initialHours: number = 5): CountdownTime {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Initialize with hours, random minutes and seconds for variety
    return initialHours * 3600 + Math.floor(Math.random() * 60) * 60 + Math.floor(Math.random() * 60);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          // Reset to a new random time when it hits zero
          return 5 * 3600 + Math.floor(Math.random() * 60) * 60 + Math.floor(Math.random() * 60);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return { hours, minutes, seconds };
}
