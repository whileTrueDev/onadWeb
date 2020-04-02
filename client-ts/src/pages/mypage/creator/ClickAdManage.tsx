import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import AdChatOnOffCard from '../../../organisms/mypage/creator/ClickAdManage/AdChatOnOffCard';
import AdPanelCard from '../../../organisms/mypage/creator/ClickAdManage/AdPanelCard';
import AdDescriptionCard from '../../../organisms/mypage/creator/ClickAdManage/AdDescriptionCard';
import LevelBar from '../../../organisms/mypage/creator/ClickAdManage/LevelBar';

export default function AdDashboard(): JSX.Element {
  return (
    <>

      <GridContainer>

        <GridItem xs={12} sm={12} xl={6}>
          <GridContainer>

            {/* 광고페이지 현황 */}
            <GridItem xs={12} md={4}>
              <AdDescriptionCard title="채팅 광고 클릭 수" value={64} unit="회" />
            </GridItem>

            <GridItem xs={12} md={4}>
              <AdDescriptionCard title="패널 광고 클릭 수" value={64} unit="회" />
            </GridItem>

            <GridItem xs={12} md={4}>
              <AdDescriptionCard title="총 클릭 수" value={128} unit="회" />
            </GridItem>

            <GridItem xs={12} md={4}>
              <AdDescriptionCard title="내 광고 레벨" value={128} unit="Lv">
                <LevelBar level={10} exp={434} />
              </AdDescriptionCard>
            </GridItem>

          </GridContainer>
        </GridItem>

        <GridItem xs={12} md={6} lg={4} xl={3}>
          <GridContainer>

            <GridItem xs={12}>
              <AdChatOnOffCard />
            </GridItem>

            <GridItem xs={12}>
              <AdPanelCard />
            </GridItem>

          </GridContainer>

        </GridItem>
      </GridContainer>
    </>
  );
}
