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
    <GridItem sm={12} md={10}>
      <ContractionCard />
    </GridItem>
    <GridItem xs={12} sm={4} xl={3}>
      <IncomCard />
      <LandingCard />
    </GridItem>
    <GridItem xs={12} sm={7} xl={7}>
      <IncomeChart />
    </GridItem>
    <GridItem xs={12} sm={1} xl={2} />
    <GridItem xs={12} sm={6}>
      <BannerCard />
    </GridItem>
    <GridItem xs={12} sm={5} xl={4}>
      <UrlCard />
    </GridItem>
    <GridItem xs={12} sm={1} xl={2} />
  </GridContainer>
);

export default Dashboard;
