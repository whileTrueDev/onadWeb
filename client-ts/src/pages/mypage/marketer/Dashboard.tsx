import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CampaignList from '../../../organisms/mypage/marketer/dashboard/CampaignList';
import CanvasForChart from '../../../organisms/mypage/marketer/dashboard/CanvasForChart';
import CashPopper from '../../../organisms/mypage/marketer/dashboard/CashPopper';
import DashboardLoading from '../../../organisms/mypage/marketer/dashboard/DashboardLoading';
import DescCard from '../../../organisms/mypage/marketer/dashboard/DescCard';
import LogTable from '../../../organisms/mypage/marketer/dashboard/LogTable';
import MarketerCustomerServiceCard from '../../../organisms/mypage/marketer/dashboard/MarketerCustomerServiceCard';
import OrderList from '../../../organisms/mypage/marketer/dashboard/OrderList';
import CashChargeDialog from '../../../organisms/mypage/marketer/office/cash/CashChargeDialog';
import OnOffSwitch from '../../../organisms/mypage/marketer/shared/OnOffSwitch';
import { useMarketerAd } from '../../../utils/hooks/query/useMarketerAd';
import { useMarketerAdAnalysisCreatorCount } from '../../../utils/hooks/query/useMarketerAdAnalysisCreatorCount';
import { useMarketerCampaignActive } from '../../../utils/hooks/query/useMarketerCampaignActive';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';
import useDialog from '../../../utils/hooks/useDialog';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      width: 1430,
      margin: '0 auto',
    },
  },
  buttons: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export default function Dashboard(): JSX.Element {
  const classes = useStyles();
  const chargeDialog = useDialog();

  const { anchorEl, handleAnchorOpen, handleAnchorClose } = useAnchorEl();
  const campaignActive = useMarketerCampaignActive();
  const adData = useMarketerAd();
  const counts = useMarketerAdAnalysisCreatorCount();

  useMypageScrollToTop();

  return (
    <div className={classes.root}>
      {adData.isLoading || counts.isLoading ? (
        <DashboardLoading />
      ) : (
        <div>
          {adData.data && counts.data && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <OnOffSwitch />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MarketerCustomerServiceCard />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Grow in timeout={{ enter: 300 }}>
                      <DescCard
                        data={{
                          title: '광고 캐시 잔액',
                          value: adData.data.cashAmount,
                          unit: '원',
                        }}
                        button={
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={(event): void => {
                              if (anchorEl) handleAnchorClose();
                              else handleAnchorOpen(event);
                            }}
                          >
                            충전
                          </Button>
                        }
                      />
                    </Grow>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Grow in timeout={{ enter: 700 }}>
                      <DescCard
                        data={{
                          title: '총 소진 비용',
                          value: adData.data.spendAll,
                          unit: '원',
                        }}
                      />
                    </Grow>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Grow in timeout={{ enter: 1100 }}>
                      <DescCard
                        data={{
                          title: '운용중 캠페인',
                          value:
                            !campaignActive.isLoading && campaignActive.data
                              ? campaignActive.data.activeCampaignCount
                              : 0,
                          unit: '캠페인',
                        }}
                      />
                    </Grow>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Grow in timeout={{ enter: 1500 }}>
                      <DescCard
                        data={{
                          title: '송출방송인수',
                          value: counts.data.counts,
                          unit: '명',
                        }}
                      />
                    </Grow>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Grid container spacing={2}>
                  <Hidden mdDown>
                    <Grid item xs={9} md={3} lg={9}>
                      <CanvasForChart />
                    </Grid>
                    <Grid item xs={3} md={3} lg={3}>
                      <LogTable />
                    </Grid>
                  </Hidden>
                  <Grid item xs={12} lg={6}>
                    <CampaignList />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <OrderList />
                  </Grid>
                </Grid>
              </Grid>

              <CashPopper
                anchorEl={anchorEl}
                handleAnchorClose={handleAnchorClose}
                handleOpen={chargeDialog.handleOpen}
              />
              <CashChargeDialog
                open={chargeDialog.open}
                handleClose={chargeDialog.handleClose}
                currentCash={adData.data.cashAmount.toString()}
              />
            </Grid>
          )}
        </div>
      )}
    </div>
  );
}
