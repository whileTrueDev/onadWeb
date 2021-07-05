// atoms
import { Hidden } from '@material-ui/core';
import { useState } from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import history from '../../../history';
import { CurrentBannerRes } from '../../../organisms/mypage/creator/CampaignManage/NowBroadCard';
import AlertCard from '../../../organisms/mypage/creator/Dashboard/AlertCard';
import BannerCard from '../../../organisms/mypage/creator/Dashboard/BannerCard';
import ClickAdCard, { ClicksRes } from '../../../organisms/mypage/creator/Dashboard/ClickAdCard';
import CustomerServiceCard from '../../../organisms/mypage/creator/Dashboard/CustomerServiceCard';
import EventInfoCard from '../../../organisms/mypage/creator/Dashboard/EventInfoCard';
import IncomeChart, {
  IncomeChartParams,
} from '../../../organisms/mypage/creator/Dashboard/IncomeChart';
import NoticeCard from '../../../organisms/mypage/creator/Dashboard/NoticeCard';
import UserInfoCard, {
  IncomeCashRes,
} from '../../../organisms/mypage/creator/Dashboard/UserInfoCard';
import OverlayUrlCard from '../../../organisms/mypage/creator/shared/OverlayUrlCard';
// organisms
import StartGuideCard from '../../../organisms/mypage/creator/shared/StartGuideCard';
import WithdrawalDialog from '../../../organisms/mypage/creator/shared/WithdrawalDialog';
import PlatformLinkDialog from '../../../organisms/mypage/shared/PlatformLinkDialog';
import { ChartDataBase } from '../../../utils/chart/makeBarChartData';
import { useCreatorBannerOverlay } from '../../../utils/hooks/query/useCreatorBannerOverlay';
import { useCreatorProfile } from '../../../utils/hooks/query/useCreatorProfile';
import { useNoticeList } from '../../../utils/hooks/query/useNoticeList';
import useDialog from '../../../utils/hooks/useDialog';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';
import MypageLoading from './Mypage.loading';

const Dashboard = (): JSX.Element => {
  // 계약 정보 조회
  const profile = useCreatorProfile();
  // 배너 송출 URL 정보 조회
  const overlayUrl = useCreatorBannerOverlay();
  // 수익금 정보 조회
  const incomeCashGet = useGetRequest<null, IncomeCashRes>('/creator/income');
  // 광고페이지 정보 조회
  const clicksGet = useGetRequest<null, ClicksRes>('/creator/clicks');
  // 수익금 차트 정보 조회
  const incomeChartGet = useGetRequest<IncomeChartParams, ChartDataBase[]>(
    '/creator/income/chart',
    { dateRange: '30' },
  );
  // 현재 송출중 배너 정보 조회
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  // 공지사항 정보 조회
  const noticeList = useNoticeList();
  // 출금 내역 정보
  const withdrawalData = useGetRequest('/creator/income/withdrawal');
  // 리모트 컨트롤러 URL 정보
  const remoteControllerUrlGet = useGetRequest<null, string>('/creator/remote/page-url');

  // 채널 연동 유도 다이얼로그
  const platformLinkDialog = useDialog();

  // 출금 신청 다이얼로그
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    if (incomeCashGet.data && !(incomeCashGet.data.settlementState === 2)) {
      alert('정산등록 신청이 승인되지 않았습니다. 내 수익 관리 탭에서 정산 등록을 진행해주세요.');
      history.push('/mypage/creator/income');
    } else {
      setOpen(true);
    }
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  useMypageScrollToTop();
  return (
    <>
      <div style={{ margin: '0 auto', maxWidth: 1430 }}>
        {profile.isLoading ||
        incomeCashGet.loading ||
        clicksGet.loading ||
        incomeChartGet.loading ||
        currentBannerGet.loading ||
        overlayUrl.isLoading ? (
          <MypageLoading />
        ) : (
          <GridContainer direction="row">
            {/* 출금신청 다이얼로그 */}
            {incomeCashGet.data &&
              Boolean(incomeCashGet.data.creatorContractionAgreement) &&
              incomeCashGet.data.creatorAccountNumber && (
                <WithdrawalDialog
                  open={open}
                  handleClose={handleClose}
                  realName={incomeCashGet.data.realName}
                  accountNumber={incomeCashGet.data.creatorAccountNumber}
                  receivable={incomeCashGet.data.creatorReceivable}
                />
              )}

            {/* 배너 권장 크기 및 무효화 공지 */}
            {!profile.isLoading &&
              profile.data &&
              Boolean(profile.data.creatorContractionAgreement) && (
                <Hidden smDown>
                  <GridItem xs={12}>
                    <AlertCard />
                  </GridItem>
                </Hidden>
              )}

            {/* 온애드 시작 가이드 */}
            <GridItem xs={12} lg={6}>
              {!overlayUrl.isLoading && overlayUrl.data && !profile.isLoading && profile.data && (
                <StartGuideCard />
              )}
            </GridItem>

            {/* 배너 광고 송출 URL */}
            <GridItem xs={12} lg={6}>
              {!overlayUrl.isLoading && overlayUrl.data && (
                <OverlayUrlCard overlayUrlData={overlayUrl.data} />
              )}
            </GridItem>

            {/* 유저 정보 및 수익금 카드 */}
            <GridItem xs={12} lg={6}>
              {!incomeCashGet.loading &&
                incomeCashGet.data &&
                !profile.isLoading &&
                profile.data &&
                !withdrawalData.loading && (
                  <UserInfoCard
                    withdrawalData={withdrawalData.data}
                    incomeData={incomeCashGet.data}
                    handleWithdrawalDialogOpen={handleOpen}
                  />
                )}
            </GridItem>

            {/* 수익금 차트 카드 */}
            <GridItem xs={12} lg={6}>
              {!incomeChartGet.loading && (
                <IncomeChart incomeChartData={incomeChartGet.data ? incomeChartGet.data : []} />
              )}
            </GridItem>

            {/* 현재 송출중 배너 카드 */}
            <GridItem xs={12} lg={6}>
              {!incomeChartGet.loading && (
                <BannerCard
                  remoteControllerUrlData={remoteControllerUrlGet}
                  currentBannerData={currentBannerGet.data ? currentBannerGet.data : []}
                />
              )}
            </GridItem>

            {/* 클릭광고 카드 */}
            <GridItem xs={12} lg={6}>
              {!clicksGet.loading && clicksGet.data && <ClickAdCard clicksData={clicksGet.data} />}
            </GridItem>

            {/* 공지사항 카드 */}
            <GridItem xs={12} sm={6}>
              {!noticeList.isLoading && noticeList.data && <NoticeCard />}
            </GridItem>

            {/* 고객센터 카드 */}
            <GridItem xs={12} sm={6} lg={3}>
              <CustomerServiceCard />
            </GridItem>

            {/* 이벤트 알림 카드 */}
            <GridItem xs={12} sm={6} lg={3}>
              <EventInfoCard />
            </GridItem>
          </GridContainer>
        )}
      </div>

      {!profile.isLoading &&
        profile.data &&
        !profile.data.creatorTwitchOriginalId &&
        !profile.data.afreecaId && (
          <PlatformLinkDialog
            open={platformLinkDialog.open}
            handleOpen={platformLinkDialog.handleOpen}
            onClose={platformLinkDialog.handleClose}
          />
        )}
    </>
  );
};
export default Dashboard;
