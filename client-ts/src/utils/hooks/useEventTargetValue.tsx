import React from 'react';

export default function useEventTargetValue(defaultValue = ''): {
  value: string;
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  handleReset(): void;
} {
  const [value, setValue] = React.useState(defaultValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setValue(e.target.value);
  }

  function handleReset(): void {
    setValue(defaultValue);
  }

  return { value, handleChange, handleReset };
}
