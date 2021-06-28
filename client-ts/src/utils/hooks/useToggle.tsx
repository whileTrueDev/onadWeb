import { useState } from 'react';

export default function useToggle(defaultToggle = false): {
  toggle: boolean;
  handleToggle: () => void;
} {
  const [toggle, setToggle] = useState<boolean>(defaultToggle);
  function handleToggle(): void {
    setToggle(!toggle);
  }
  return { toggle, handleToggle };
}
