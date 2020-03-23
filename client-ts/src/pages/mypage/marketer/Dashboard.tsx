import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import CampaignList from '../../../organisms/mypage/marketer/dashboard/CampaignList';
import CanvasForChart from '../../../organisms/mypage/marketer/dashboard/CanvasForChart';
import DescCard from '../../../organisms/mypage/marketer/dashboard/DescCard';
import OnOffSwitch from '../../../organisms/mypage/marketer/dashboard/OnOffSwitch';
import ReportLoading from '../../../organisms/mypage/marketer/dashboard/ReportLoading';
import LogTable from '../../../organisms/mypage/marketer/dashboard/LogTable';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import {
  CampaignInterface, OnOffInterface, AdInterface, CountInterface,
  ValueChartInterface, ActionLogInterface
} from '../../../organisms/mypage/marketer/dashboard/interfaces';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      margin: '0px 160px'
    }
  }
}));

export default function Dashboard() {
  const classes = useStyles();

  const campaignData = useGetRequest<null, CampaignInterface[] | null>('/marketer/campaign/list');
  const onOffData = useGetRequest<null, OnOffInterface | null>('/marketer/ad/on-off');
  const adData = useGetRequest<null, AdInterface | null>('/marketer/ad');
  const countsData = useGetRequest<null, CountInterface | null>('/marketer/ad/analysis/creator-count');
  const valueChartData = useGetRequest<null, ValueChartInterface[] | null>('/marketer/ad/analysis/expenditure');
  const broadCreatorData = useGetRequest<null, string[] | null>('/marketer/ad/analysis/creator/list');
  const actionLogData = useGetRequest<null, ActionLogInterface[] | null>('/marketer/history');


  return (
    <div className={classes.root}>
      {(adData.loading
        || countsData.loading
        || valueChartData.loading
        || countsData.loading) ? (
          <ReportLoading />
        ) : (
          <div>
            {adData.data && valueChartData.data && countsData.data && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <OnOffSwitch onOffData={onOffData} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grow in timeout={{ enter: 300 }}>
                        <DescCard data={{
                          title: '광고 캐시 잔액', value: adData.data.cashAmount, unit: '원'
                        }}
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
                          value: (!campaignData.loading && campaignData.data) ? campaignData.data.filter((c) => c.onOff === 1).length : 0,
                          unit: '캠페인'
                        }}
                        />
                      </Grow>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grow in timeout={{ enter: 1500 }}>
                        <DescCard data={{
                          title: '송출크리에이터수', value: countsData.data.counts, unit: '명'
                        }}
                        />
                      </Grow>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CampaignList campaignData={campaignData} />
                    </Grid>
                    <Grid item xs={12}>
                      <CanvasForChart
                        valueChartData={valueChartData}
                        broadCreatorData={broadCreatorData}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                  <LogTable
                    actionLogData={actionLogData}
                  />
                </Grid>
              </Grid>
            )}
          </div>
        )}
    </div>
  );
}
