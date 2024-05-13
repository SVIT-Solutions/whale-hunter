import { useEffect, useRef, useState } from 'react';

export const useHeight = (initialValue: number) => {
  const ref = useRef(null);
  const [height, setHeight] = useState<number>(initialValue);

  useEffect(() => {
    const handleResize = () => {
      const maxHeight = ref.current?.getBoundingClientRect()?.height;
      if (!maxHeight) return;
      setHeight(maxHeight);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref.current]);

  return {
    ref,
    height,
  };
};
