import { Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import AdClickCard from '../../../../organisms/mypage/creator/CampaignManage/AdClickCard';
import ChatAdInfo from '../../../../organisms/mypage/creator/CampaignManage/ChatAdInfo';
import ClickAdInfo from '../../../../organisms/mypage/creator/CampaignManage/ClickAdInfo';
import NowBroadCard from '../../../../organisms/mypage/creator/CampaignManage/NowBroadCard';
import IncomeChart from '../../../../organisms/mypage/creator/Dashboard/IncomeChart';
import AdIncomeCard from '../../../../organisms/mypage/creator/shared/AdIncomeCard';
import OverlayUrlCard from '../../../../organisms/mypage/creator/shared/OverlayUrlCard';
import StartGuideCard from '../../../../organisms/mypage/creator/shared/StartGuideCard';
import { useCreatorBannerOverlay } from '../../../../utils/hooks/query/useCreatorBannerOverlay';
// hooks
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const CampaignManage = (): JSX.Element => {
  // 배너 송출 URL 정보 조회
  const overlayUrl = useCreatorBannerOverlay();

  useMypageScrollToTop();
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
export default CampaignManage;
