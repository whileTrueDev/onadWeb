import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import CampaignList from '../../organisms/marketer/Dashboard/CampaignList';
import CanvasForChart from '../../organisms/marketer/Dashboard/CanvasForChart';
import DescCard from '../../organisms/marketer/Dashboard/DescCard';
import OnOffSwitch from '../../organisms/marketer/Dashboard/OnOffSwitch';
import ReportLoading from '../../organisms/marketer/Dashboard/ReportLoading';
import IssueTable from '../../organisms/marketer/Dashboard/IssueTable';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import {
  campaignInterface, onOffInterface, adInterface, countInterface,
  valueChartInterface, boroadCreatorInterface, actionLogInterface
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

  const campaignData = useGetRequest<null, campaignInterface[]>('/marketer/campaign/list');
  const onOffData = useGetRequest<null, onOffInterface>('/marketer/ad/on-off');
  const adData = useGetRequest<null, adInterface>('/marketer/ad');
  const countsData = useGetRequest<null, countInterface>('/marketer/ad/analysis/creator-count');
  const valueChartData = useGetRequest<null, valueChartInterface[]>('/marketer/ad/analysis/expenditure');
  const broadCreatorData = useGetRequest<null, boroadCreatorInterface[]>('/marketer/ad/analysis/creator/list');
  const actionLogData = useGetRequest<null, actionLogInterface[]>('/marketer/history');


  return (
    <div className={classes.root}>
      {(adData.loading || campaignData.loading
        || onOffData.loading
        || countsData.loading
        || valueChartData.loading
        || actionLogData.loading
        || countsData.loading) ? (
          <ReportLoading />
        ) : (
          <div>
            {adData.data && campaignData.data
              && valueChartData.data && countsData.data && (
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
                            value: campaignData.data.filter((c) => c.onOff === 1).length,
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
                    <IssueTable
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
