import React from 'react';
// atoms
import { Hidden } from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
// organisms
import StartGuideCard from '../../../organisms/mypage/creator/shared/StartGuideCard';
import AlertCard from '../../../organisms/mypage/creator/Dashboard/AlertCard';
import UserInfoCard, { IncomeCashRes } from '../../../organisms/mypage/creator/Dashboard/UserInfoCard';
import WithdrawalDialog from '../../../organisms/mypage/creator/shared/WithdrawalDialog';
import ClickAdCard, { ClicksRes, LevelRes } from '../../../organisms/mypage/creator/Dashboard/ClickAdCard';
import IncomeChart, { IncomeChartParams } from '../../../organisms/mypage/creator/Dashboard/IncomeChart';
import BannerCard from '../../../organisms/mypage/creator/Dashboard/BannerCard';
import OverlayUrlCard, { OverlayUrlRes } from '../../../organisms/mypage/creator/shared/OverlayUrlCard';
import MypageLoading from './Mypage.loading';
import NoticeCard from '../../../organisms/mypage/creator/Dashboard/NoticeCard';
import CustomerServiceCard from '../../../organisms/mypage/creator/Dashboard/CustomerServiceCard';
import EventInfoCard from '../../../organisms/mypage/creator/Dashboard/EventInfoCard';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useDialog from '../../../utils/hooks/useDialog';
import { ContractionDataType } from './CPAManage';
import PlatformLinkDialog from '../../../organisms/mypage/shared/PlatformLinkDialog';
import history from '../../../history';
import { NoticeData } from '../../../organisms/mypage/shared/notice/NoticeTable';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';
import { ChartDataBase } from '../../../utils/chart/makeBarChartData';
import { CurrentBannerRes } from '../../../organisms/mypage/creator/CampaignManage/NowBroadCard';

const Dashboard = (): JSX.Element => {
  // 계약 정보 조회
  const profileGet = useGetRequest<null, ContractionDataType>('/creator');
  // 수익금 정보 조회
  const incomeCashGet = useGetRequest<null, IncomeCashRes>('/creator/income');
  // 광고페이지 정보 조회
  const clicksGet = useGetRequest<null, ClicksRes>('/creator/clicks');
  // 크리에이터 광고 레벨 정보 조회
  const levelGet = useGetRequest<null, LevelRes>('/creator/level');
  // 수익금 차트 정보 조회
  const incomeChartGet = useGetRequest<IncomeChartParams, ChartDataBase[]>(
    '/creator/income/chart', { dateRange: '30' }
  );
  // 현재 송출중 배너 정보 조회
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  // 배너 송출 URL 정보 조회
  const overlayUrlGet = useGetRequest<null, OverlayUrlRes>('/creator/banner/overlay');
  // 공지사항 정보 조회
  const noticeGet = useGetRequest<null, NoticeData[]>('/notice');
  // 출금 내역 정보
  const withdrawalData = useGetRequest('/creator/income/withdrawal');
  // 리모트 컨트롤러 URL 정보
  const remoteControllerUrlGet = useGetRequest<null, string>('/creator/remote/page-url');

  // 채널 연동 유도 다이얼로그
  const platformLinkDialog = useDialog();

  // 오버레이 url 복사 성공 알림 스낵바를 위한 객체
  const snack = useDialog();

  // 출금 신청 다이얼로그
  const [open, setOpen] = React.useState(false);
  const handleOpen = (): void => {
    if (incomeCashGet.data && !(incomeCashGet.data.settlementState === 2)) {
      alert('정산등록 신청이 승인되지 않았습니다. 내 수익 관리 탭에서 정산 등록을 진행해주세요.');
      history.push('/mypage/creator/income');
    } else {
      setOpen(true);
    }
  };
  const handleClose = (): void => { setOpen(false); };

  useMypageScrollToTop();
  return (
    <>
      <div style={{ margin: '0 auto', maxWidth: 1430 }}>
        {(profileGet.loading || incomeCashGet.loading
        || clicksGet.loading || levelGet.loading || incomeChartGet.loading
        || currentBannerGet.loading || overlayUrlGet.loading) ? (
          <MypageLoading />
          ) : (
            <GridContainer direction="row">

              {/* 출금신청 다이얼로그 */}
              {incomeCashGet.data && Boolean(incomeCashGet.data.creatorContractionAgreement)
            && incomeCashGet.data.creatorAccountNumber && (
              <WithdrawalDialog
                open={open}
                handleClose={handleClose}
                realName={incomeCashGet.data.realName}
                accountNumber={incomeCashGet.data.creatorAccountNumber}
                receivable={incomeCashGet.data.creatorReceivable}
              />
              )}

              {/* 배너 권장 크기 및 무효화 공지 */}
              {!profileGet.loading && profileGet.data
                && Boolean(profileGet.data.creatorContractionAgreement)
                && (
                  <Hidden smDown>
                    <GridItem xs={12}>
                      <AlertCard />
                    </GridItem>
                  </Hidden>
                )}

              {/* 온애드 시작 가이드 */}
              <GridItem xs={12} lg={6}>
                {!overlayUrlGet.loading && overlayUrlGet.data
                && !profileGet.loading && profileGet.data && (
                <StartGuideCard
                  doContractionDataRequest={profileGet.doGetRequest}
                  doOverlayUrlDataRequest={overlayUrlGet.doGetRequest}
                  doRemoteControllerUrlRequest={remoteControllerUrlGet.doGetRequest}
                  overlayUrlData={overlayUrlGet.data}
                  contractionData={profileGet.data}
                  handleSnackOpen={snack.handleOpen}
                />
                )}
              </GridItem>

              {/* 배너 광고 송출 URL */}
              <GridItem xs={12} lg={6}>
                {!overlayUrlGet.loading && overlayUrlGet.data && (
                <OverlayUrlCard
                  overlayUrlData={overlayUrlGet.data}
                  handleSnackOpen={snack.handleOpen}
                />
                )}
              </GridItem>

              {/* 유저 정보 및 수익금 카드 */}
              <GridItem xs={12} lg={6}>
                {!incomeCashGet.loading && incomeCashGet.data
                && !profileGet.loading && profileGet.data
                && !withdrawalData.loading && (
                <UserInfoCard
                  userProfileData={profileGet.data}
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
                {!levelGet.loading && levelGet.data && !clicksGet.loading && clicksGet.data && (
                <ClickAdCard levelData={levelGet.data} clicksData={clicksGet.data} />
                )}
              </GridItem>

              {/* 공지사항 카드 */}
              <GridItem xs={12} sm={6}>
                {!noticeGet.loading && noticeGet.data && (
                  <NoticeCard noticeData={noticeGet.data} />
                )}
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

      {!profileGet.loading && profileGet.data
      && (!profileGet.data.creatorTwitchOriginalId && !profileGet.data.afreecaId)
      && (
      <PlatformLinkDialog
        open={platformLinkDialog.open}
        handleOpen={platformLinkDialog.handleOpen}
        onClose={platformLinkDialog.handleClose}
      />
      )}

      <Snackbar
        color="success"
        message="클립보드에 복사되었어요! 방송도구에 등록해주세요"
        open={snack.open}
        onClose={snack.handleClose}
      />
    </>
  );
};
export default Dashboard;
