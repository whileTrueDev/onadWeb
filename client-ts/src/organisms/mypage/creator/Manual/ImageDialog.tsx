import React from 'react';
import Dialog from '../../../../atoms/Dialog/Dialog';

interface ImageDialogProps {
  open: boolean;
  title?: string;
  imageSrc: string;
  handleDialogClose: () => void;
}
export default function ImageDialog({
  open,
  imageSrc,
  handleDialogClose,
  title = '',
}: ImageDialogProps): JSX.Element {
  return (
    <Dialog
      title={title}
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={imageSrc} alt="" style={{ minWidth: 350, maxWidth: 1280, maxHeight: 520 }} />
      </div>
    </Dialog>
  );
}
