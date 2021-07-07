import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';
import { useMarketerDeleteCampaignMutation } from '../../../../utils/hooks/mutation/useMarketerDeleteCampaignMutation';
import { CampaignInterface } from './interfaces';

interface CampaignDeleteConfirmDialogProps {
  open: boolean;
  selectedCampaign: CampaignInterface;
  handleClose: () => void;
}

export default function CampaignDeleteConfirmDialog(
  props: CampaignDeleteConfirmDialogProps,
): JSX.Element {
  const { open, handleClose, selectedCampaign } = props;
  const { enqueueSnackbar } = useSnackbar();
  const deleteCampaignMutation = useMarketerDeleteCampaignMutation();

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      buttons={
        <div>
          <Button
            color="primary"
            onClick={(): void => {
              deleteCampaignMutation
                .mutateAsync({ campaignId: selectedCampaign.campaignId })
                .then(() => {
                  enqueueSnackbar('캠페인 삭제 성공', { variant: 'success' });
                  handleClose();
                })
                .catch(() => {
                  enqueueSnackbar(
                    '캠페인 삭제에 실패했습니다. 문제가 지속되는 경우 support@onad.io로 문의바랍니다.',
                    { variant: 'error' },
                  );
                });
            }}
          >
            삭제
          </Button>
          <Button onClick={handleClose}>취소</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">해당 캠페인을 삭제하시겠습니까?</Typography>
        </div>
        <div>
          <Typography variant="body1">삭제시, 진행중이던 광고는 모두 중지됩니다.</Typography>
        </div>
      </div>
    </Dialog>
  );
}
