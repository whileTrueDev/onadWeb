import React from 'react';
import { Button } from '@material-ui/core';
import Dialog from '../../../../../atoms/Dialog/Dialog';

interface DetailCampaignDialogProps {
  changeHandle: { open: boolean; handleOpen: () => void; handleClose: () => void };
}

function DetailCampaignDialog({
  changeHandle
}: DetailCampaignDialogProps): JSX.Element {
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
      dfasdfasdf
    </Dialog>
  );
}

export default DetailCampaignDialog;
