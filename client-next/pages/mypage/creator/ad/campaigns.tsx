import { Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import AdClickCard from '../../../../components/mypage/creator/ad/campaigns/adClickCard';
import ChatAdInfo from '../../../../components/mypage/creator/ad/campaigns/chatAdInfo';
import ClickAdInfo from '../../../../components/mypage/creator/ad/campaigns/clickAdInfo';
import NowBroadCard from '../../../../components/mypage/creator/ad/campaigns/nowBroadCard';
import IncomeChart from '../../../../components/mypage/creator/main/incomeChart';
import AdIncomeCard from '../../../../components/mypage/creator/shared/adIncomeCard';
import OverlayUrlCard from '../../../../components/mypage/creator/shared/overlayUrlCard';
import StartGuideCard from '../../../../components/mypage/creator/shared/startGuideCard';
import { useCreatorBannerOverlay } from '../../../../utils/hooks/query/useCreatorBannerOverlay';
import DashboardLayout from '../../../../components/mypage/layouts/creatorDashboardLayout';

const Campaigns = (): JSX.Element => {
  // 배너 송출 URL 정보 조회
  const overlayUrl = useCreatorBannerOverlay();

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        {/* 광고 시작 가이드 */}
        <GridItem xs={12} lg={6}>
          <StartGuideCard />
        </GridItem>

        {/* 배너 광고 오버레이 URL */}
        <GridItem xs={12} lg={6}>
          <OverlayUrlCard overlayUrlData={overlayUrl.data} />
        </GridItem>

        {/* 현재 송출 배너 광고 정보 */}
        <GridItem xs={12} lg={6}>
          <NowBroadCard />
        </GridItem>

        {/* 클릭광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ClickAdInfo />
        </GridItem>

        {/* 채팅광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ChatAdInfo />
        </GridItem>

        <GridItem xs={12} lg={6}>
          <AdIncomeCard />
        </GridItem>
        <GridItem xs={12} lg={6}>
          <AdClickCard />
        </GridItem>

        <GridItem xs={12}>
          <IncomeChart
            title={
              <Typography style={{ fontWeight: 'bold', marginBottom: 8 }}>광고 현황</Typography>
            }
          />
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default Campaigns;

Campaigns.layout = DashboardLayout;
