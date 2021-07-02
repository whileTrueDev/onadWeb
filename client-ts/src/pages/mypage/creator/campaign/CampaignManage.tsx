import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
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
import OverlayUrlCard, {
  OverlayUrlRes,
} from '../../../../organisms/mypage/creator/shared/OverlayUrlCard';
import StartGuideCard, {
  ContractionDataType,
} from '../../../../organisms/mypage/creator/shared/StartGuideCard';
import { ChartDataBase } from '../../../../utils/chart/makeBarChartData';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

interface LanidngUrlRes {
  url: string;
}
interface AdChatRes {
  adChatAgreement: 1 | 0;
}
interface ClicksRes {
  adpanel: number;
  adchat: number;
}
interface LevelRes {
  creatorId: string;
  level: number;
  exp: number;
}

const CampaignManage = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  // Adchat agreement
  const adchatGet = useGetRequest<null, AdChatRes>('/creator/adchat/agreement');
  // Creator click data
  const clicksSummaryGet = useGetRequest<null, ClicksRes>('/creator/clicks');
  // 현재 송출중 배너 정보 조회
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  // 계약 정보 조회
  const profileGet = useGetRequest<null, ContractionDataType>('/creator');
  // 배너 송출 URL 정보 조회
  const overlayUrlGet = useGetRequest<null, OverlayUrlRes>('/creator/banner/overlay');

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
          {!overlayUrlGet.loading && overlayUrlGet.data && !profileGet.loading && profileGet.data && (
            <StartGuideCard
              doContractionDataRequest={profileGet.doGetRequest}
              doOverlayUrlDataRequest={overlayUrlGet.doGetRequest}
              overlayUrlData={overlayUrlGet.data}
              contractionData={profileGet.data}
              handleSnackOpen={() => {
                enqueueSnackbar('정상적으로 변경되었습니다.', { variant: 'success' });
              }}
            />
          )}
        </GridItem>

        {/* 배너 광고 오버레이 URL */}
        <GridItem xs={12} lg={6}>
          {overlayUrlGet.loading && (
            <OverlayUrlCard
              overlayUrlData={{
                advertiseUrl: '',
                creatorContractionAgreement: 0,
              }}
              handleSnackOpen={() => {
                enqueueSnackbar('클립보드에 복사되었어요! 방송도구에 등록해주세요', {
                  variant: 'success',
                });
              }}
            />
          )}
          {!overlayUrlGet.loading && overlayUrlGet.data && (
            <OverlayUrlCard
              overlayUrlData={overlayUrlGet.data}
              handleSnackOpen={() => {
                enqueueSnackbar('클립보드에 복사되었어요! 방송도구에 등록해주세요', {
                  variant: 'success',
                });
              }}
            />
          )}
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
          <ClickAdInfo profileData={profileGet} />
        </GridItem>

        {/* 채팅광고 정보 */}
        <GridItem xs={12} sm={6} lg={3}>
          <ChatAdInfo
            contracitonAgreementData={profileGet}
            adChatData={adchatGet}
            doGetReqeustOnOff={adchatGet.doGetRequest}
            successSnackOpen={() => {
              enqueueSnackbar('정상적으로 변경되었습니다.', { variant: 'success' });
            }}
            failSnackOpen={() => {
              enqueueSnackbar('변경중 오류가 발생했습니다.', { variant: 'error' });
            }}
          />
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
