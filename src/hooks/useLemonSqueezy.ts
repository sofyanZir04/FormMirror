// hooks/useLemonSqueezy.ts
import { useEffect, useState } from 'react';

export const useLemonSqueezy = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkLemonSqueezy = () => {
      if (typeof (window as any).createLemonSqueezy === 'function') {
        setIsLoaded(true);
      }
    };

    // Check immediately
    checkLemonSqueezy();

    // Also check after a delay
    const timer = setTimeout(checkLemonSqueezy, 1000);

    return () => clearTimeout(timer);
  }, []);

  return isLoaded;
};