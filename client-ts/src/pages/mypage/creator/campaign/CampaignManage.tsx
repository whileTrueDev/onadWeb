import { Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import AdClickCard from '../../../../organisms/mypage/creator/CampaignManage/AdClickCard';
import ChatAdInfo from '../../../../organisms/mypage/creator/CampaignManage/ChatAdInfo';
import ClickAdInfo from '../../../../organisms/mypage/creator/CampaignManage/ClickAdInfo';
import NowBroadCard, {
  CurrentBannerRes,
} from '../../../../organisms/mypage/creator/CampaignManage/NowBroadCard';
import IncomeChart, {
  IncomeChartParams,
} from '../../../../organisms/mypage/creator/Dashboard/IncomeChart';
import AdIncomeCard from '../../../../organisms/mypage/creator/shared/AdIncomeCard';
import OverlayUrlCard from '../../../../organisms/mypage/creator/shared/OverlayUrlCard';
import StartGuideCard from '../../../../organisms/mypage/creator/shared/StartGuideCard';
import { ChartDataBase } from '../../../../utils/chart/makeBarChartData';
import { useCreatorBannerOverlay } from '../../../../utils/hooks/query/useCreatorBannerOverlay';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

interface AdChatRes {
  adChatAgreement: 1 | 0;
}
interface ClicksRes {
  adpanel: number;
  adchat: number;
}

const CampaignManage = (): JSX.Element => {
  // Adchat agreement
  const adchatGet = useGetRequest<null, AdChatRes>('/creator/adchat/agreement');
  // Creator click data
  const clicksSummaryGet = useGetRequest<null, ClicksRes>('/creator/clicks');
  // 현재 송출중 배너 정보 조회
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  // 배너 송출 URL 정보 조회
  const overlayUrl = useCreatorBannerOverlay();

  // 리모트 컨트롤러 URL 정보
  const remoteControllerUrlGet = useGetRequest<null, string>('/creator/remote/page-url');

  // 수익금 차트 정보 조회
  const incomeChartGet = useGetRequest<IncomeChartParams, ChartDataBase[]>(
    '/creator/income/chart',
    { dateRange: '30' },
  );

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
          <NowBroadCard
            currentBannerGet={currentBannerGet}
            remoteControllerUrlGet={remoteControllerUrlGet}
          />
        </GridItem>

        {/* 클릭광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ClickAdInfo />
        </GridItem>

        {/* 채팅광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ChatAdInfo adChatData={adchatGet} doGetReqeustOnOff={adchatGet.doGetRequest} />
        </GridItem>

        <GridItem xs={12} lg={6}>
          <AdIncomeCard />
        </GridItem>
        <GridItem xs={12} lg={6}>
          <AdClickCard clicksSummaryData={clicksSummaryGet} />
        </GridItem>

        <GridItem xs={12}>
          {!incomeChartGet.loading && (
            <IncomeChart
              title={
                <Typography style={{ fontWeight: 'bold', marginBottom: 8 }}>광고 현황</Typography>
              }
              incomeChartData={incomeChartGet.data ? incomeChartGet.data : []}
            />
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default CampaignManage;
