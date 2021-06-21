import React from 'react';

/**
 * deprecated
 * useDialog를 사용.
 */
export default function useOpenValue(): {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
} {
  const [open, setOpen] = React.useState(false);
  function handleOpen(): void {
    setOpen(true);
  }
  function handleClose(): void {
    setOpen(false);
  }
  return { open, handleOpen, handleClose };
}
