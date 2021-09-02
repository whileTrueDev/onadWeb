import { Button, Grid, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import OnadBanner from '../../../../../atoms/banner/onadBanner';
import Dialog from '../../../../../atoms/dialog/dialog';
import { useMarketerDeleteBannerMutation } from '../../../../../utils/hooks/mutation/useMarketerDeleteBannerMutation';
import { useMarketerBannerConnectedCampaigns } from '../../../../../utils/hooks/query/useMarketerBannerConnectedCampaigns';
import { MarketerBanner } from '../../../../../utils/hooks/query/useMarketerBannerList';
import openKakaoChat from '../../../../../utils/openKakaoChat';

const useStyles = makeStyles(() => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface DeleteDialogProps {
  open: boolean;
  selectedBanner: MarketerBanner;
  handleClose: () => void;
  onSuccess?: () => void;
}

const DeleteDialog = (props: DeleteDialogProps): JSX.Element => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { open, selectedBanner, handleClose, onSuccess } = props;

  const deleteBannerMutation = useMarketerDeleteBannerMutation();

  const connectedCampaign = useMarketerBannerConnectedCampaigns(selectedBanner.bannerId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="해당 배너를 삭제하시겠습니까?"
      fullWidth
      maxWidth="sm"
      buttons={
        <div style={{ display: 'flex' }}>
          {!connectedCampaign.isLoading &&
            connectedCampaign.data &&
            connectedCampaign.data.length > 0 && (
              <Tooltip
                title={<Typography>배너가 캠페인에 할당되어 있어 삭제가 불가능합니다.</Typography>}
              >
                <div>
                  <Button variant="contained" color="primary" disabled>
                    확인
                  </Button>
                </div>
              </Tooltip>
            )}
          {!connectedCampaign.isLoading &&
            connectedCampaign.data &&
            connectedCampaign.data.length === 0 && (
              <Button
                variant="contained"
                color="primary"
                disabled={deleteBannerMutation.isLoading}
                onClick={(): void => {
                  deleteBannerMutation
                    .mutateAsync({ bannerId: selectedBanner.bannerId })
                    .then(() => {
                      if (onSuccess) onSuccess();
                      enqueueSnackbar('배너 삭제 완료되었습니다.', {
                        variant: 'success',
                        preventDuplicate: false,
                      });
                      handleClose();
                    })
                    .catch(() => {
                      enqueueSnackbar(
                        '배너 삭제에 실패했습니다. 문제가 지속되는 경우 support@onad.io로 문의바랍니다.',
                        { variant: 'error' },
                      );
                    });
                }}
              >
                확인
              </Button>
            )}
          <Button variant="contained" onClick={handleClose}>
            취소
          </Button>
        </div>
      }
    >
      <Grid container direction="column" spacing={2}>
        <Grid item className={classes.center}>
          <OnadBanner
            src={selectedBanner.bannerSrc}
            alt={selectedBanner.bannerId}
            width="320"
            height="160"
          />
        </Grid>
        {selectedBanner.bannerDenialReason && (
          <Grid item>
            <div>
              <Typography variant="body1">거절사유: </Typography>
              <Typography variant="body1" color="error">
                {selectedBanner.bannerDenialReason}
              </Typography>
            </div>
          </Grid>
        )}
        <Grid item>
          <Alert severity="info" icon={false}>
            <span role="img" aria-label="warning">
              ⚠️
            </span>
            <Typography variant="body2">
              배너가 캠페인에 할당되어 있는 경우 삭제가 불가능합니다.
            </Typography>
            <Typography variant="body2">캠페인을 먼저 정리하신 후 삭제해주세요.</Typography>
            <span role="img" aria-label="calling">
              📞
            </span>
            <Typography variant="body2">
              배너 등록 관련 도움은 support@onad.io 로 메일을 보내주시거나,
            </Typography>
            <Typography variant="body2">
              <Typography
                variant="body2"
                component="span"
                color="primary"
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={openKakaoChat}
              >
                onad 카카오톡 채널
              </Typography>
              에서 상담가능합니다.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default DeleteDialog;
