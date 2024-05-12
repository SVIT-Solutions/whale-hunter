import React, { useState } from 'react';

export const useInput = <T>(initialValue: T) => {
  const [value, setValue] = useState<T | null>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value as T);
  };

  const clearValue = () => {
    setValue(null);
  };

  return {
    value,
    onChange: handleChange,
    clearValue,
  };
};
