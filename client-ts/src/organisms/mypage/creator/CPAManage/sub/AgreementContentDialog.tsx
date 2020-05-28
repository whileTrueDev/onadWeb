import React from 'react';
import { Button } from '@material-ui/core';
import Dialog from '../../../../../atoms/Dialog/Dialog';

interface AgreementContentDialogProps {
  changeHandle: { open: boolean; handleOpen: () => void; handleClose: () => void };
  source: { explain: string; agreementText: string };
}

function AgreementContentDialog({
  changeHandle, source
}: AgreementContentDialogProps): JSX.Element {
  return (
    <Dialog
      open={Boolean(changeHandle.open)}
      onClose={changeHandle.handleClose}
      fullWidth
      maxWidth="md"
      buttons={(
        <div>
          <Button onClick={(): void => {
            changeHandle.handleClose();
          }}
          >
            확인
          </Button>
        </div>
      )}
    >
      {source.agreementText}
    </Dialog>
  );
}

export default AgreementContentDialog;
