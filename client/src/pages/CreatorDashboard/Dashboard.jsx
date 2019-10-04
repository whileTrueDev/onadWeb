import React from 'react';
import {
  Grid
} from '@material-ui/core';
import IncomCard from './IncomeCard';
import UrlCard from './UrlCard';
import BannerCard from './BannerCard';
import LandingCard from './LandingCard';
import ContractionCard from './ContractionCard';


const Dashboard = () => (
  <Grid container direction="row">
    <Grid item sm={12} md={11}>
      <ContractionCard />
    </Grid>
    <Grid item xs={12} sm={4} xl={3}>
      <IncomCard />
      <LandingCard />
    </Grid>
    <Grid item xs={12} sm={7} xl={7}>
      <div>그래프 영역</div>
    </Grid>
    <Grid item xs={12} sm={1} xl={2} />
    <Grid item xs={12} sm={6}>
      <BannerCard />
    </Grid>
    <Grid item xs={12} sm={5} xl={4}>
      <UrlCard />
    </Grid>
    <Grid item xs={12} sm={1} xl={2} />
  </Grid>
);

export default Dashboard;
