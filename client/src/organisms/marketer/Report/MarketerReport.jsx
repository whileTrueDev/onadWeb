import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';

import DescCard from './sub/marketerSub/DescCard';
import CampaignList from './sub/marketerSub/CampaignList';
import BannerList from './sub/marketerSub/BannerList';
import CanvasForChart from './sub/marketerSub/CanvasForChart';
import IssueTable from './sub/marketerSub/IssueTable';
import OnOffSwitch from './sub/marketerSub/OnOffSwitch';

const dummy = [
  {
    title: '운용중 캠페인', value: '2', unit: '캠페인', timein: 300
  },
  {
    title: '보유 광고 캐시', value: '255555', unit: '원', timein: 700
  },
  {
    title: '총 소진 비용', value: '100000000', unit: '원', timein: 1100
  },
  {
    title: '송출크리에이터수', value: '255', unit: '명', timein: 1500
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      margin: '0px 160px'
    }
  }
}));

export default function MarketerReport() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {dummy.map(d => (
          <Grid item key={d.title} xs={12} sm={6} lg={3}>
            <Grow in timeout={{ enter: d.timein }}>
              <DescCard data={d} />
            </Grow>
          </Grid>
        ))}

        <Grid item xs={12} lg={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OnOffSwitch />
            </Grid>
            <Grid item xs={12}>
              <CampaignList
                handleCampaignClick={() => {
                  console.log('handleCampaignClick');
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <BannerList />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CanvasForChart />
            </Grid>
            <Grid item xs={12}>
              <IssueTable />
            </Grid>
          </Grid>
        </Grid>


      </Grid>
    </div>
  );
}
