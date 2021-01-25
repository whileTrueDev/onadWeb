import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Tooltip, Grid, Button
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import useDeleteRequest from '../../../../../utils/hooks/useDeleteRequest';
import { BannerDataInterface } from '../interface';
import isVideo from '../../../../../utils/isVideo';
import VideoBanner from '../../../../../atoms/Banner/VideoBanner';
import openKakaoChat from '../../../../../utils/openKakaoChat';

const useStyles = makeStyles((theme: Theme) => ({
  img: {
    maxHeight: '200px',
    maxWidth: '100%'
  },
  reasonText: {
    marginLeft: theme.spacing(2),
    color: 'red'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface DeleteDialogProps {
  open: boolean;
  selectedBanner: BannerDataInterface;
  handleClose: () => void;
  recallRequest: () => void;
}


const DeleteDialog = (props: DeleteDialogProps): JSX.Element => {
  const classes = useStyles();
  const {
    open, selectedBanner, handleClose, recallRequest
  } = props;

  const { doDeleteRequest } = useDeleteRequest<{ bannerId: string }, any[]>('/marketer/banner');

  const connectedCampaign = useGetRequest<{ bannerId: string }, { campaignId: string }[]>('/marketer/banner/campaigns', {
    bannerId: selectedBanner.bannerId
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="해당 배너를 삭제하시겠습니까?"
      fullWidth
      maxWidth="sm"
      buttons={(
        <div style={{ display: 'flex' }}>
          {!connectedCampaign.loading
            && connectedCampaign.data
            && connectedCampaign.data.length > 0 && (
              <Tooltip title={<Typography>배너가 캠페인에 할당되어 있어 삭제가 불가능합니다.</Typography>}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                  >
                    확인
                  </Button>
                </div>
              </Tooltip>
          )}
          {!connectedCampaign.loading
            && connectedCampaign.data
            && connectedCampaign.data.length === 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={(): void => {
                  doDeleteRequest({ bannerId: selectedBanner.bannerId });
                  setTimeout(() => {
                    handleClose();
                    recallRequest();
                  }, 500);
                }}
              >
                확인
              </Button>
          )}
          <Button variant="contained" onClick={handleClose}>취소</Button>
        </div>
      )}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item className={classes.center}>
          { isVideo(selectedBanner.bannerSrc) ? (
            <VideoBanner
              src={selectedBanner.bannerSrc}
              width="320"
              height="160"
            />
          ) : (
            <img
              src={selectedBanner.bannerSrc}
              alt={selectedBanner.bannerId}
              width="320"
              height="160"
            />
          )}
        </Grid>
        {selectedBanner.bannerDenialReason && (
          <Grid item>
            <div>
              <Typography variant="body1">거절사유: </Typography>
              <Typography variant="body1" color="error">{selectedBanner.bannerDenialReason}</Typography>
            </div>
          </Grid>
        )}
        <Grid item>
          <Alert severity="info" icon={false}>
            <span role="img" aria-label="warning">⚠️</span>
            <Typography variant="body2">
              배너가 캠페인에 할당되어 있는 경우 삭제가 불가능합니다.
            </Typography>
            <Typography variant="body2">캠페인을 먼저 정리하신 후 삭제해주세요.</Typography>
            <span role="img" aria-label="calling">📞</span>
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
