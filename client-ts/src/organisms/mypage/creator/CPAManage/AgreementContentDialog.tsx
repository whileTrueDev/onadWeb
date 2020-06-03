import React from 'react';
import { Button, Typography } from '@material-ui/core';
import shortid from 'shortid';
import Dialog from '../../../../atoms/Dialog/Dialog';

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
      title={(
        <div>
          <Typography variant="h6">
            유의사항
          </Typography>
        </div>
      )}
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
      {source.agreementText.split('\n').map((sentence) => (
        <p style={{ fontWeight: 500 }} key={shortid.generate()}>{sentence}</p>
      ))}
    </Dialog>
  );
}

export default AgreementContentDialog;
