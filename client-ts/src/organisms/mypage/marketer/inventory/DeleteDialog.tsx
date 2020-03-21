import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Tooltip, Grid } from '@material-ui/core';
import CustomButton from '../../../../atoms/CustomButtons/Button';
import StyledItemText from '../../../../atoms/StyledItemText';
import Dialog from '../../../../atoms/Dialog/Dialog';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useDeleteRequest from '../../../../utils/hooks/useDeleteRequest';
import { BannerDataInterface } from './interface';
import history from '../../../../history';

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
}


const DeleteDialog = (props: DeleteDialogProps): JSX.Element => {
  const classes = useStyles();
  const {
    open, selectedBanner, handleClose
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
                <CustomButton
                  color="primary"
                  disabled
                >
                  확인
                </CustomButton>
              </div>
            </Tooltip>
          )}
          {!connectedCampaign.loading
          && connectedCampaign.data
          && connectedCampaign.data.length === 0 && (
            <CustomButton
              color="primary"
              onClick={(): void => {
                doDeleteRequest({ bannerId: selectedBanner.bannerId });
                setTimeout(() => {
                  handleClose();
                  history.push(window.location.pathname);
                }, 1000);
              }}
            >
              확인
            </CustomButton>
          )}
          <CustomButton onClick={handleClose}>취소</CustomButton>
        </div>
      )}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item className={classes.center}>
          <img
            src={selectedBanner.bannerSrc}
            alt={selectedBanner.bannerId}
            className={classes.img}
          />
        </Grid>
        {selectedBanner.bannerDenialReason && (
          <Grid item>
            <div>
              <StyledItemText primary="거절 사유:" fontSize="18px" />
              <Typography variant="body1" className={classes.reasonText}>{selectedBanner.bannerDenialReason}</Typography>
            </div>
          </Grid>
        )}
        <Grid item>
          <Typography variant="body2">
            <span role="img" aria-label="warning">⚠️</span>
            {' '}
            배너가 캠페인에 할당되어 있는 경우 삭제가 불가능합니다. 캠페인을 먼저 정리하신 후 삭제해주세요.
          </Typography>
          <Typography variant="body2">
            <span role="img" aria-label="calling">📞</span>
            {' '}
            배너 등록 관련 도움은 support@onad.io 로 메일을 보내주시거나, onad 카카오톡 채널에서 상담가능합니다.
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default DeleteDialog;
