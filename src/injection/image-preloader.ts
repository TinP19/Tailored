export function preloadImage(src: string, timeoutMs: number = 1000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();

    const timer = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      reject(new Error(`Image preload timed out after ${timeoutMs}ms: ${src}`));
    }, timeoutMs);

    img.onload = () => {
      clearTimeout(timer);
      resolve();
    };

    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Image failed to load: ${src}`));
    };

    img.src = src;
  });
}
