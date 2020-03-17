import React from 'react';
import { Hidden } from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import ContractionCard from '../../../organisms/mypage/creator/Dashboard/ContractionCard';
import NotificationCard from '../../../organisms/mypage/creator/Dashboard/NotificationCard';
import IncomeCard from '../../../organisms/mypage/creator/Dashboard/IncomeCard';
import IncomeChart from '../../../organisms/mypage/creator/Dashboard/IncomeChart';
import BannerCard from '../../../organisms/mypage/creator/Dashboard/BannerCard';
import LandingCard from '../../../organisms/mypage/creator/Dashboard/LandingCard';
import UrlCard from '../../../organisms/mypage/creator/Dashboard/OverlayUrlCard';

const Dashboard = (): JSX.Element => (
  <GridContainer direction="row">

    <GridItem sm={12} xl={10}>
      <ContractionCard />
    </GridItem>
    <Hidden smDown>
      <GridItem sm={12} xl={9}>
        <NotificationCard />
      </GridItem>
    </Hidden>
    <Hidden lgDown>
      <GridItem xl={3} />
    </Hidden>
    <GridItem xs={12} xl={3}>
      <GridContainer>
        <GridItem xs={12} md={6} xl={12}>
          <IncomeCard />
        </GridItem>
        <GridItem xs={12} md={6} xl={12}>
          <LandingCard />
        </GridItem>
      </GridContainer>
    </GridItem>

    <GridItem xs={12} xl={6}>
      <IncomeChart />
    </GridItem>

    <GridItem xs={12} sm={6} lg={4}>
      <BannerCard />
    </GridItem>

    <GridItem xs={12} sm={6} lg={4}>
      <UrlCard />
    </GridItem>

    <GridItem xs={12} sm={1} xl={2} />
  </GridContainer>
);

export default Dashboard;
