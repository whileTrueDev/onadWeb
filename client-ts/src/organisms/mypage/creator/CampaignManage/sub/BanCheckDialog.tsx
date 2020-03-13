import React from 'react';
// material ui core
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
// customized component
import StyledItemText from '../../../../../atoms/StyledItemText';
import Button from '../../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../../atoms/Dialog/Dialog';
// type
import { CampaignTableData } from './CampaignTable';
// utils
import useDeleteRequest from '../../../../../utils/hooks/useDeleteRequest';

const useStyles = makeStyles((theme) => ({
  dialog: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  dialogContent: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

interface BanCheckDialogProps {
  open: boolean;
  handleDialogClose: () => void;
  handleSnackOpen: () => void;
  campaign: CampaignTableData;
  doCampaignGetRequest: () => void;
}
function BanCheckDialog({
  open, handleDialogClose, handleSnackOpen, campaign, doCampaignGetRequest
}: BanCheckDialogProps): JSX.Element {
  const classes = useStyles();

  const campaignDelete = useDeleteRequest('/creator/banner', () => {
    doCampaignGetRequest(); // 캠페인 데이터 재 요청
    handleDialogClose(); // 현재 다이얼로그 닫기
    handleSnackOpen(); // 성공함을 알리는 스낵바 오픈
  });

  const handleSubmit = (): void => {
    campaignDelete.doDeleteRequest({ campaignId: campaign.campaignId });
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      title="이 배너 광고 그만하기"
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Button
            color="primary"
            onClick={handleSubmit}
          >
            진행
          </Button>
          <Button onClick={handleDialogClose}>
            취소
          </Button>
        </div>
      )}
    >
      <div className={classes.dialog}>
        <Grid container>
          {/* 출금가능금액 */}
          <Grid item>
            <div>
              <img src={campaign.bannerSrc} alt="banner" style={{ maxHeight: '200px', width: '100%' }} />
            </div>
          </Grid>
          <Grid item className={classes.dialogContent}>
            <StyledItemText primary="해당 광고의 송출을 중단하시겠어요?" secondary="지금까지의 광고료는 정산되며, 더 이상 이 배너가 송출되지 않습니다." />
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}

export default BanCheckDialog;
