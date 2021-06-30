import { Button, CircularProgress, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import CampaignOnOffSwitch from '../../../../atoms/Switch/CampaignOnOffSwitch';
import history from '../../../../history';
import { useGetRequest } from '../../../../utils/hooks';
import useDialog from '../../../../utils/hooks/useDialog';
import { CONFIRM_STATE_REJECTED } from '../../../../utils/render_funcs/renderBannerConfirmState';
import CampaignMetaInfoCard from '../adManage/campaign/sub/CampaignMetaInfoCard';
import { CampaignInterface } from './interfaces';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  article: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    [theme.breakpoints.only('xs')]: { flexWrap: 'wrap' },
  },
  loading: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  moreButton: { margin: theme.spacing(0, 1, 1) },
}));

export default function CampaignList(): JSX.Element {
  const OFFSET = 4;
  const classes = useStyles();

  const campaignData = useGetRequest<{ page: number; offset: number }, CampaignInterface[]>(
    '/marketer/campaign/list',
    { page: 0, offset: OFFSET },
  );

  const snack = useDialog();
  const failSnack = useDialog();

  return (
    <Paper style={{ minHeight: 400 }}>
      <div className={classes.title}>
        <Typography variant="h6">내 캠페인</Typography>
        {campaignData.data && campaignData.data.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={(): void => {
              history.push('/mypage/marketer/inventory/campaigns');
            }}
          >
            더보기
          </Button>
        )}
      </div>

      <Divider />

      {campaignData.loading && (
        <Grid item xs={12} className={classes.loading}>
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
          </div>
        </Grid>
      )}

      {campaignData.data && (
        <div>
          <article className={classes.article}>
            {campaignData.data
              .filter(cam => cam.confirmState !== CONFIRM_STATE_REJECTED)
              .slice(0, 2)
              .map((campaign: CampaignInterface) => (
                <CampaignMetaInfoCard
                  key={campaign.campaignId}
                  campaign={campaign}
                  switchComponent={
                    <CampaignOnOffSwitch
                      campaign={campaign}
                      onSuccess={(): void => {
                        campaignData.doGetRequest();
                        snack.handleOpen();
                      }}
                      onFail={(): void => {
                        failSnack.handleOpen();
                      }}
                    />
                  }
                />
              ))}
          </article>

          <div style={{ textAlign: 'center' }}>
            <Button
              className={classes.moreButton}
              variant="outlined"
              color="primary"
              onClick={(): void => {
                history.push('/mypage/marketer/campaigncreate');
              }}
            >
              캠페인 생성
            </Button>
          </div>
        </div>
      )}

      {!campaignData.loading && campaignData.data && campaignData.data.length === 0 && (
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          alignContent="center"
          style={{ height: 300 }}
        >
          <Grid item style={{ textAlign: 'center' }}>
            <Typography variant="body2">생성된 캠페인이 없습니다.</Typography>
            <Typography variant="body2">새로운 캠페인을 생성해 광고를 진행하세요.</Typography>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snack.open}
        onClose={snack.handleClose}
        color="success"
        message="캠페인 On/Off 상태 변경 완료"
      />

      <Snackbar
        open={failSnack.open}
        onClose={failSnack.handleClose}
        color="error"
        message="캠페인 On/Off 상태 변경에 실패했습니다. 잠시 후 다시 시도해주세요. 지속적으로 문제가 발견될 시 support@onad.io로 문의바랍니다."
      />
    </Paper>
  );
}
