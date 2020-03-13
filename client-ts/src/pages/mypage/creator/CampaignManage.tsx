import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import BannerTableCard from '../../../organisms/mypage/creator/CampaignManage/CampaignTableCard';

const CampaignManage = (): JSX.Element => (
  <GridContainer direction="row">
    <GridItem sm={12} md={10}>
      <BannerTableCard />
    </GridItem>
  </GridContainer>
);
export default CampaignManage;
