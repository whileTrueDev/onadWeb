import React from 'react';
import { Hidden } from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
// import IncomCard from '../../organisms/creator/Dashboard/IncomeCard';
// import UrlCard from '../../organisms/creator/Dashboard/UrlCard';
// import BannerCard from '../../organisms/creator/Dashboard/BannerCard';
// import LandingCard from '../../organisms/creator/Dashboard/LandingCard';
// import ContractionCard from '../../organisms/creator/Dashboard/ContractionCard';
// import IncomeChart from '../../organisms/creator/Dashboard/IncomeChart';
// import NotificationCard from '../../organisms/creator/Dashboard/NotificationCard';

const Dashboard = () => (
  <GridContainer direction="row">

    <GridItem sm={12} xl={10}>
      {/* <ContractionCard /> */}
      ContractionCard
    </GridItem>
    <Hidden smDown>
      <GridItem sm={12} xl={9}>
        {/* <NotificationCard /> */}
        NotificationCard
      </GridItem>
    </Hidden>
    <Hidden lgDown>
      <GridItem xl={3} />
    </Hidden>
    <GridItem xs={12} xl={3}>
      <GridContainer>
        <GridItem xs={12} md={6} xl={12}>
          {/* <IncomCard /> */}
          incomeCard
        </GridItem>
        <GridItem xs={12} md={6} xl={12}>
          {/* <LandingCard /> */}
          LandingCard
        </GridItem>
      </GridContainer>
    </GridItem>

    <GridItem xs={12} xl={6}>
      {/* <IncomeChart /> */}
      IncomeChart
    </GridItem>

    <GridItem xs={12} sm={4}>
      {/* <BannerCard /> */}
      BannerCard
    </GridItem>

    <GridItem xs={12} sm={4}>
      {/* <UrlCard /> */}
      UrlCard
    </GridItem>

    <GridItem xs={12} sm={1} xl={2} />
  </GridContainer>
);

export default Dashboard;
