import React from 'react';

import Dialog from '../../../atoms/Dialog/Dialog';

export default function UrlUploadDialog(props) {
  const { open, handleClose } = props;

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="URL 등록"
    >
      <div>
        url 생성 폼
      </div>
    </Dialog>
  );
}
