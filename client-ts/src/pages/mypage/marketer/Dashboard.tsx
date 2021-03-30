import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import CampaignList from '../../../organisms/mypage/marketer/dashboard/CampaignList';
import CanvasForChart from '../../../organisms/mypage/marketer/dashboard/CanvasForChart';
import DescCard from '../../../organisms/mypage/marketer/dashboard/DescCard';
import OnOffSwitch from '../../../organisms/mypage/marketer/shared/OnOffSwitch';
import DashboardLoading from '../../../organisms/mypage/marketer/dashboard/DashboardLoading';
import LogTable from '../../../organisms/mypage/marketer/dashboard/LogTable';
import CashPopper from '../../../organisms/mypage/marketer/dashboard/CashPopper';

// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';
import useDialog from '../../../utils/hooks/useDialog';

import CashChargeDialog from '../../../organisms/mypage/marketer/office/cash/CashChargeDialog';

import {
  OnOffInterface, AdInterface, CountInterface,
  ValueChartInterface, ActionLogInterface, CPSChartInterface
} from '../../../organisms/mypage/marketer/dashboard/interfaces';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';
import MarketerCustomerServiceCard from '../../../organisms/mypage/marketer/dashboard/MarketerCustomerServiceCard';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      width: 1430,
      margin: '0 auto',
    }
  },
  buttons: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}));

export default function Dashboard(): JSX.Element {
  const classes = useStyles();
  const chargeDialog = useDialog();

  const { anchorEl, handleAnchorOpen, handleAnchorClose } = useAnchorEl();
  const campaignData = useGetRequest<null, {activeCampaignCount: number} | null>('/marketer/campaign/active');
  const onOffData = useGetRequest<null, OnOffInterface | null>('/marketer/ad/on-off');
  const adData = useGetRequest<null, AdInterface | null>('/marketer/ad');
  const countsData = useGetRequest<null, CountInterface | null>('/marketer/ad/analysis/creator-count');
  const actionLogData = useGetRequest<null, ActionLogInterface[] | null>('/marketer/history');
  const valueChartData = useGetRequest<null, ValueChartInterface[]>('/marketer/ad/analysis/expenditure');
  const cpsChartData = useGetRequest<null, CPSChartInterface[]>('/marketer/ad/analysis/expenditure/cps');

  useMypageScrollToTop();

  return (
    <div className={classes.root}>
      {(adData.loading || countsData.loading
      || valueChartData.loading || countsData.loading) ? (
        <DashboardLoading />
        ) : (
          <div>
            {adData.data && valueChartData.data && countsData.data && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <OnOffSwitch onOffData={onOffData} />
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
                            title: '광고 캐시 잔액', value: adData.data.cashAmount, unit: '원'
                          }}
                          button={(
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={(event): void => {
                                if (anchorEl) handleAnchorClose();
                                else handleAnchorOpen(event);
                              }}
                            >
                              충전
                            </Button>
                          )}
                        />
                      </Grow>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grow in timeout={{ enter: 700 }}>
                        <DescCard data={{
                          title: '총 소진 비용', value: adData.data.spendAll, unit: '원'
                        }}
                        />
                      </Grow>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grow in timeout={{ enter: 1100 }}>
                        <DescCard data={{
                          title: '운용중 캠페인',
                          value: (!campaignData.loading && campaignData.data)
                            ? campaignData.data.activeCampaignCount
                            : 0,
                          unit: '캠페인'
                        }}
                        />
                      </Grow>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grow in timeout={{ enter: 1500 }}>
                        <DescCard data={{
                          title: '송출방송인수', value: countsData.data.counts, unit: '명'
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
                        <CanvasForChart
                          valueChartData={valueChartData}
                          cpsChartData={cpsChartData}
                        />
                      </Grid>
                      <Grid item xs={3} md={3} lg={3}>
                        <LogTable actionLogData={actionLogData} />
                      </Grid>
                    </Hidden>
                    <Grid item xs={12} md={12}>
                      <CampaignList />
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
