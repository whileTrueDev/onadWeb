import { Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
// hooks
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useDialog from '../../../../utils/hooks/useDialog';
import NowBroadCard, {
  CurrentBannerRes,
} from '../../../../organisms/mypage/creator/CampaignManage/NowBroadCard';
import ChatAdInfo from '../../../../organisms/mypage/creator/CampaignManage/ChatAdInfo';
import ClickAdInfo from '../../../../organisms/mypage/creator/CampaignManage/ClickAdInfo';
import AdIncomeCard from '../../../../organisms/mypage/creator/shared/AdIncomeCard';
import AdClickCard from '../../../../organisms/mypage/creator/CampaignManage/AdClickCard';
import StartGuideCard, {
  ContractionDataType,
} from '../../../../organisms/mypage/creator/shared/StartGuideCard';
import OverlayUrlCard, {
  OverlayUrlRes,
} from '../../../../organisms/mypage/creator/shared/OverlayUrlCard';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';
import IncomeChart, {
  IncomeChartParams,
} from '../../../../organisms/mypage/creator/Dashboard/IncomeChart';
import { ChartDataBase } from '../../../../utils/chart/makeBarChartData';

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
  // 배너광고 그만하기 성공시 스낵바
  const banSuccessSnack = useDialog();

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

  // For Onoff success snackbar
  const snack = useDialog();
  const failSnack = useDialog();
  const overlayUrlCopySnack = useDialog();

  useMypageScrollToTop();
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        {/* 광고 시작 가이드 */}
        <GridItem xs={12} lg={6}>
          {!overlayUrlGet.loading &&
            overlayUrlGet.data &&
            !profileGet.loading &&
            profileGet.data && (
              <StartGuideCard
                doContractionDataRequest={profileGet.doGetRequest}
                doOverlayUrlDataRequest={overlayUrlGet.doGetRequest}
                overlayUrlData={overlayUrlGet.data}
                contractionData={profileGet.data}
                handleSnackOpen={snack.handleOpen}
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
              handleSnackOpen={overlayUrlCopySnack.handleOpen}
            />
          )}
          {!overlayUrlGet.loading && overlayUrlGet.data && (
            <OverlayUrlCard
              overlayUrlData={overlayUrlGet.data}
              handleSnackOpen={overlayUrlCopySnack.handleOpen}
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
            successSnackOpen={snack.handleOpen}
            failSnackOpen={failSnack.handleOpen}
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

        <Snackbar
          color="success"
          open={snack.open}
          message="정상적으로 변경되었습니다."
          onClose={snack.handleClose}
        />

        <Snackbar
          color="error"
          open={failSnack.open}
          message="변경중 오류가 발생했습니다."
          onClose={failSnack.handleClose}
        />

        <Snackbar
          open={banSuccessSnack.open}
          message="배너광고 거절을 완료하였습니다."
          color="success"
          onClose={banSuccessSnack.handleClose}
        />

        <Snackbar
          open={overlayUrlCopySnack.open}
          message="클립보드에 복사되었어요! 방송도구에 등록해주세요"
          color="success"
          onClose={overlayUrlCopySnack.handleClose}
        />
      </GridContainer>
    </div>
  );
};
export default CampaignManage;
