import * as React from 'react';
import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import CPSChart from '../../../../components/mypage/creator/ad/cps/CPSChart';
import CPSMetaInfo from '../../../../components/mypage/creator/ad/cps/CPSMetaInfo';
import CPSReviews from '../../../../components/mypage/creator/ad/cps/CPSReviews';
import DashboardLayout from '../../../../components/mypage/layouts/creatorDashboardLayout';

export default function CPS(): React.ReactElement {
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

CPS.layout = DashboardLayout;
