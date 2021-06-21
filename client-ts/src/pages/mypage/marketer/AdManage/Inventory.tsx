import React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import InventoryManage from '../../../../organisms/mypage/marketer/adManage/InventoryManage';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const CampaignManage = (): JSX.Element => {
  useMypageScrollToTop();

  return (
    <GridContainer>
      <GridItem xs={12}>
        <InventoryManage />
      </GridItem>
    </GridContainer>
  );
};

export default CampaignManage;
