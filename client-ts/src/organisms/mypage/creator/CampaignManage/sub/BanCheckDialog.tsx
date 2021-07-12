import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// customized component
import { useSnackbar } from 'notistack';
import Button from '../../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import StyledItemText from '../../../../../atoms/StyledItemText';
import { useCreatorBanBannerMutation } from '../../../../../utils/hooks/mutation/useCreatorBanBannerMutation';
// type
import { CampaignTableData } from './CampaignTable';

const useStyles = makeStyles(theme => ({
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
  campaign: CampaignTableData;
}
function BanCheckDialog({ open, handleDialogClose, campaign }: BanCheckDialogProps): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const campaignDelete = useCreatorBanBannerMutation();

  const handleSubmit = (): void => {
    campaignDelete.mutateAsync({ campaignId: campaign.campaignId }).then(() => {
      handleDialogClose(); // 현재 다이얼로그 닫기
      enqueueSnackbar('이제 이 배너는 더이상 송출되지 않습니다.', { variant: 'success' }); // 성공함을 알리는 스낵바 오픈
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      title="이 배너 광고 그만하기"
      maxWidth="sm"
      fullWidth
      buttons={
        <div>
          <Button color="primary" onClick={handleSubmit}>
            진행
          </Button>
          <Button onClick={handleDialogClose}>취소</Button>
        </div>
      }
    >
      <div className={classes.dialog}>
        <Grid container>
          {/* 출금가능금액 */}
          <Grid item>
            <div>
              <img
                src={campaign.bannerSrc}
                alt="banner"
                style={{ maxHeight: '200px', width: '100%' }}
              />
            </div>
          </Grid>
          <Grid item className={classes.dialogContent}>
            <StyledItemText
              primary="해당 광고의 송출을 중단하시겠어요?"
              secondary="지금까지의 광고료는 정산되며, 더 이상 이 배너가 송출되지 않습니다."
            />
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}

export default BanCheckDialog;
