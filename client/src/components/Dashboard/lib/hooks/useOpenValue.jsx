import React from 'react';

export default function useOpenValue() {
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return { open, handleOpen, handleClose };
}
