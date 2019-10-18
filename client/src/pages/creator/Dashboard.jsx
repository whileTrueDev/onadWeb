import React from 'react';
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import IncomCard from '../../organisms/creator/Dashboard/IncomeCard';
import UrlCard from '../../organisms/creator/Dashboard/UrlCard';
import BannerCard from '../../organisms/creator/Dashboard/BannerCard';
import LandingCard from '../../organisms/creator/Dashboard/LandingCard';
import ContractionCard from '../../organisms/creator/Dashboard/ContractionCard';
import IncomeChart from '../../organisms/creator/Dashboard/IncomeChart';

const Dashboard = () => (
  <GridContainer direction="row">
    <GridItem sm={12} xl={10}>
      <ContractionCard />
    </GridItem>
    <GridItem xs={12} xl={3}>
      <GridContainer>
        <GridItem xs={12} md={6} xl={12}>
          <IncomCard />
        </GridItem>
        <GridItem xs={12} md={6} xl={12}>
          <LandingCard />
        </GridItem>
      </GridContainer>
    </GridItem>

    <GridItem xs={12} xl={7}>
      <IncomeChart />
    </GridItem>

    <GridItem xs={12} sm={6}>
      <BannerCard />
    </GridItem>

    <GridItem xs={12} sm={6} xl={4}>
      <UrlCard />
    </GridItem>

    <GridItem xs={12} sm={1} xl={2} />
  </GridContainer>
);

export default Dashboard;
