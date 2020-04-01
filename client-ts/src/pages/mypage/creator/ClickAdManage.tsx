import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import AdChatOnOffCard from '../../../organisms/mypage/creator/ClickAdManage/AdChatOnOffCard';
import AdPanelCard from '../../../organisms/mypage/creator/ClickAdManage/AdPanelCard';

export default function AdDashboard(): JSX.Element {
  return (
    <>

      <GridContainer>
        <GridItem xs={12} md={6} lg={4} xl={3}>
          <AdPanelCard />
        </GridItem>
        <GridItem xs={12} md={6} lg={4} xl={3}>
          <AdChatOnOffCard />
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={6} xl={4}>
          <GridContainer>

            {/* 광고페이지 현황 */}
            <GridItem xs={12}>
              {/* {landingData.loading && (<Skeleton variant="text" height={300} />)} */}
              {/* {!landingData.loading && landingData.data && ( */}
              {/* <ClickAdDetail /> */}
              {/* )} */}
            </GridItem>

          </GridContainer>
        </GridItem>
      </GridContainer>
    </>
  );
}
