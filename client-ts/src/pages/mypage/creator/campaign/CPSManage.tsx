import * as React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import CPSChart from '../../../../organisms/mypage/creator/CampaignManage/cps/CPSChart';
import CPSMetaInfo from '../../../../organisms/mypage/creator/CampaignManage/cps/CPSMetaInfo';
import CPSReviews from '../../../../organisms/mypage/creator/CampaignManage/cps/CPSReviews';

export default function CPSManage(): React.ReactElement {
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        <GridItem xs={12}>
          <CPSMetaInfo />
        </GridItem>

        <GridItem xs={12}>
          <CPSChart />
        </GridItem>

        <GridItem xs={12}>
          <CPSReviews />
        </GridItem>
      </GridContainer>
    </div>
  );
}
