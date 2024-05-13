import { useEffect, useState } from 'react';

export const useZoomLevel = (initialValue?: number) => {
  const [zoomLevel, setZoomLevel] = useState<number>(initialValue || 1);

  useEffect(() => {
    const handleResize = () => {
      const currentZoom = 1 / window.devicePixelRatio;

      setZoomLevel(currentZoom);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return zoomLevel;
};
