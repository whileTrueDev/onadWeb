import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';

import BannerList from '../../organisms/marketer/Dashboard/BannerList';
import CampaignList from '../../organisms/marketer/Dashboard/CampaignList';
import CanvasForChart from '../../organisms/marketer/Dashboard/CanvasForChart';
import DescCard from '../../organisms/marketer/Dashboard/DescCard';
import OnOffSwitch from '../../organisms/marketer/Dashboard/OnOffSwitch';
import ReportLoading from '../../organisms/marketer/Dashboard/ReportLoading';
import IssueTable from '../../organisms/marketer/Dashboard/IssueTable';
// hooks
import useFetchData from '../../utils/lib/hooks/useFetchData';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      margin: '0px 160px'
    }
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  const campaignData = useFetchData('/api/dashboard/marketer/campaign/new');
  const onOffData = useFetchData('/api/dashboard/marketer/onoff');
  const normalData = useFetchData('/api/dashboard/marketer/normal');
  const creatorsData = useFetchData('/api/dashboard/marketer/report/creators');
  const bannerData = useFetchData('/api/dashboard/marketer/banner/all');
  const valueChartData = useFetchData('/api/dashboard/marketer/campaign/chart');
  const broadCreatorData = useFetchData('/api/dashboard/marketer/broadcast/creator');
  const actionLogData = useFetchData('/api/dashboard/marketer/actionlog');

  return (
    <div className={classes.root}>
      {(normalData.loading || campaignData.loading
        || onOffData.loading || creatorsData.loading
        || bannerData.loading || valueChartData.loading
        || broadCreatorData.loading || actionLogData.loading) ? (
          <ReportLoading />
        ) : (
          <Grid container spacing={2}>
            {normalData.payload && campaignData.payload
            && creatorsData.payload && bannerData.payload
            && valueChartData.payload && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={3}>
                  <Grow in timeout={{ enter: 300 }}>
                    <DescCard data={{
                      title: '광고 캐시 잔액', value: normalData.payload.cashAmount, unit: '원'
                    }}
                    />
                  </Grow>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Grow in timeout={{ enter: 700 }}>
                    <DescCard data={{
                      title: '총 소진 비용', value: normalData.payload.spendAll, unit: '원'
                    }}
                    />
                  </Grow>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Grow in timeout={{ enter: 1100 }}>
                    <DescCard data={{
                      title: '운용중 캠페인',
                      value: campaignData.payload.filter(c => c.onOff === 1).length,
                      unit: '캠페인'
                    }}
                    />
                  </Grow>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Grow in timeout={{ enter: 1500 }}>
                    <DescCard data={{
                      title: '송출크리에이터수', value: creatorsData.payload.length, unit: '명'
                    }}
                    />
                  </Grow>
                </Grid>
              </Grid>
            </Grid>
            )}

            <Grid item xs={12} md={6} lg={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <OnOffSwitch onOffData={onOffData} />
                </Grid>
                <Grid item xs={12}>
                  <CampaignList campaignData={campaignData} />
                </Grid>
                <Grid item xs={12}>
                  <BannerList bannerData={bannerData} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} lg={9}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CanvasForChart
                    valueChartData={valueChartData}
                    creatorsData={creatorsData}
                    broadCreatorData={broadCreatorData}
                  />
                </Grid>
                <Grid item xs={12}>
                  <IssueTable
                    actionLogData={actionLogData}
                  />
                </Grid>

              </Grid>
            </Grid>


          </Grid>
        )}
    </div>
  );
}
