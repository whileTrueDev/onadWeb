import React from 'react';
import {
  Grid
} from '@material-ui/core';
import IncomCard from '../../organisms/creator/Dashboard/IncomeCard';
import UrlCard from '../../organisms/creator/Dashboard/UrlCard';
import BannerCard from '../../organisms/creator/Dashboard/BannerCard';
import LandingCard from '../../organisms/creator/Dashboard/LandingCard';
import ContractionCard from '../../organisms/creator/Dashboard/ContractionCard';
import IncomeChart from '../../organisms/creator/Dashboard/IncomeChart';

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
      <IncomeChart />
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
