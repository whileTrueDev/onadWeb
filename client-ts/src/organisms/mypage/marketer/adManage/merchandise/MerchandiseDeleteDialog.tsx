import { Button, Grid, Tooltip, Typography } from '@material-ui/core';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import { useMarketerMerchandisesConnectedCampaigns } from '../../../../../utils/hooks/query/useMarketerMerchandisesConnectedCampaigns';
import { Merchandise } from '../../../../../utils/hooks/query/useMarketerMerchandisesList';
import useDeleteRequest from '../../../../../utils/hooks/useDeleteRequest';

interface MerchandiseDeleteDialogProps {
  open: boolean;
  selectedMerchandise: Merchandise;
  handleClose: () => void;
  onSuccess: () => void;
}

const MerchandiseDeleteDialog = (props: MerchandiseDeleteDialogProps): JSX.Element => {
  const { open, selectedMerchandise, handleClose, onSuccess } = props;

  const { loading, doDeleteRequest } =
    useDeleteRequest<{ id?: number }, any[]>('/marketer/merchandises');

  const connectedCampaign = useMarketerMerchandisesConnectedCampaigns(selectedMerchandise.id);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="해당 상품을 삭제하시겠습니까?"
      fullWidth
      maxWidth="sm"
      buttons={
        <div style={{ display: 'flex' }}>
          {!connectedCampaign.isLoading && connectedCampaign.data && connectedCampaign.data > 0 ? (
            <Tooltip
              title={<Typography>상품이 캠페인에 할당되어 있어 삭제가 불가능합니다.</Typography>}
            >
              <div>
                <Button variant="outlined" color="primary" disabled style={{ marginRight: 4 }}>
                  확인
                </Button>
              </div>
            </Tooltip>
          ) : null}
          {!connectedCampaign.isLoading && connectedCampaign.data === 0 ? (
            <Button
              style={{ marginRight: 4 }}
              variant="outlined"
              color="primary"
              disabled={loading}
              onClick={(): void => {
                doDeleteRequest({ id: selectedMerchandise.id });
                setTimeout(() => {
                  handleClose();
                  if (onSuccess) {
                    onSuccess();
                  }
                }, 1000);
              }}
            >
              확인
            </Button>
          ) : null}
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
        </div>
      }
    >
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <Typography>{`상품명: ${selectedMerchandise.name}`}</Typography>
          {selectedMerchandise.description && (
            <Typography>{`상품설명: ${selectedMerchandise.description.slice(0, 100)}`}</Typography>
          )}
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <span role="img" aria-label="warning">
              ⚠️
            </span>{' '}
            상품이 캠페인에 할당되어 있는 경우 삭제가 불가능합니다. 캠페인을 먼저 정리하신 후
            삭제해주세요.
          </Typography>
          <Typography variant="body2">
            <span role="img" aria-label="calling">
              📞
            </span>{' '}
            상품 등록 및 삭제 관련 도움은 support@onad.io 로 메일을 보내주시거나, onad 카카오톡
            채널에서 상담가능합니다.
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default MerchandiseDeleteDialog;
