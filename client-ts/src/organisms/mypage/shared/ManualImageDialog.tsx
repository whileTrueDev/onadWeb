import Dialog from '../../../atoms/Dialog/Dialog';

interface ManualImageDialogProps {
  open: boolean;
  title?: string;
  imageSrc: string;
  handleDialogClose: () => void;
}
export default function ManualImageDialog({
  open,
  imageSrc,
  handleDialogClose,
  title = '',
}: ManualImageDialogProps): JSX.Element {
  return (
    <Dialog title={title} open={open} onClose={handleDialogClose} maxWidth="lg">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={imageSrc} alt="" style={{ minWidth: 350, maxWidth: 1280, maxHeight: 520 }} />
      </div>
    </Dialog>
  );
}
