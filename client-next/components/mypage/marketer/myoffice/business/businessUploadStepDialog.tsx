import Dialog from '../../../../../atoms/dialog/dialog';
import BuisnessUploadStepManager from './business-upload-step/businessUploadStepManager';

interface BusinessRegiUploadDialogProps {
  open: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
  step: { currStep: number; isBusiness: boolean };
}

export default function BusinessRegiUploadStepDialogProps({
  open,
  handleClose,
  onSuccess,
  step,
}: BusinessRegiUploadDialogProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="세금계산서/현금영수증 발행"
      maxWidth="sm"
      scroll="body"
      fullWidth
    >
      <BuisnessUploadStepManager onSuccess={onSuccess} handleClose={handleClose} step={step} />
    </Dialog>
  );
}
