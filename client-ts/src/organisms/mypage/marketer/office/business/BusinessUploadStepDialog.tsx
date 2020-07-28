import React from 'react';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import BuisnessUploadStepManager from './businessuploadstep/BusinessUploadStepManager';

interface BusinessRegiUploadDialogProps {
  open: boolean;
  handleClose: () => void;
  businessRegiImage: string;
  request: () => void;
  handleSnackOpen: () => void;
  step: {currStep: number; isBusiness: boolean};
}

export default function BusinessRegiUploadStepDialogProps(
  props: BusinessRegiUploadDialogProps
): JSX.Element {
  const {
    open, handleClose, businessRegiImage, request, step, handleSnackOpen
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="세금계산서 발행하기/현금영수증 발행하기"
      maxWidth="md"
      scroll="body"
      fullWidth
    >
      <BuisnessUploadStepManager
        open={open}
        businessRegiImage={businessRegiImage}
        request={request}
        handleClose={handleClose}
        handleSnackOpen={handleSnackOpen}
        step={step}
      />
    </Dialog>
  );
}
