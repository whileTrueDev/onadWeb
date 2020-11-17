import React from 'react';
// atoms
import { Hidden, } from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
// organisms
import StartGuideCard from '../../../organisms/mypage/creator/Dashboard/StartGuideCard';
import AlertCard from '../../../organisms/mypage/creator/Dashboard/AlertCard';
import UserInfoCard, { IncomeCashRes } from '../../../organisms/mypage/creator/Dashboard/UserInfoCard';
import WithdrawalDialog from '../../../organisms/mypage/creator/Dashboard/WithdrawalDialog';
import ClickAdCard, { ClicksRes, LevelRes } from '../../../organisms/mypage/creator/Dashboard/ClickAdCard';
import IncomeChart, {
  IncomeChartData, IncomeChartParams
} from '../../../organisms/mypage/creator/Dashboard/IncomeChart';
import BannerCard, { CurrentBannerRes } from '../../../organisms/mypage/creator/Dashboard/BannerCard';
import OverlayUrlCard, { OverlayUrlRes } from '../../../organisms/mypage/creator/Dashboard/OverlayUrlCard';
import DashboardLoading from './Dashboard.loading';
import NoticeCard, { NoticeData } from '../../../organisms/mypage/creator/Dashboard/NoticeCard';
import CustomerServiceCard from '../../../organisms/mypage/creator/Dashboard/CustomerServiceCard';
import EventInfoCard from '../../../organisms/mypage/creator/Dashboard/EventInfoCard';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useDialog from '../../../utils/hooks/useDialog';
import { ContractionDataType } from './CPAManage';

const Dashboard = (): JSX.Element => {
  // 계약 정보 조회
  const contractionGet = useGetRequest<null, ContractionDataType>('/creator');
  // 수익금 정보 조회
  const incomeCashGet = useGetRequest<null, IncomeCashRes>('/creator/income');
  // 광고페이지 정보 조회
  const clicksGet = useGetRequest<null, ClicksRes>('/creator/clicks');
  // 크리에이터 광고 레벨 정보 조회
  const levelGet = useGetRequest<null, LevelRes>('/creator/level');
  // 수익금 차트 정보 조회
  const incomeChartGet = useGetRequest<IncomeChartParams, IncomeChartData[]>(
    '/creator/income/chart', { dateRange: '30' }
  );
  // 현재 송출중 배너 정보 조회
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  // 배너 송출 URL 정보 조회
  const overlayUrlGet = useGetRequest<null, OverlayUrlRes>('/creator/banner/overlay');
  // 공지사항 정보 조회
  const noticeGet = useGetRequest<null, NoticeData[]>('/notice');
  // 오버레이 url 복사 성공 알림 스낵바를 위한 객체
  const snack = useDialog();

  // *************************** 작업중 빼둔것.
  // 출금 신청 다이얼로그
  const [open, setOpen] = React.useState(false);
  const handleOpen = (): void => {
    if (incomeCashGet.data && !(incomeCashGet.data.settlementState === 2)) {
      alert('정산등록 신청이 승인되지 않았습니다.');
      // history.push('/mypage/creator/user');
    }
    setOpen(true);
  };
  const handleClose = (): void => { setOpen(false); };
  // *************************** 작업중 빼둔것.
  return (
    <>
      <div style={{ margin: '0 auto', maxWidth: 1430 }}>
        {(contractionGet.loading || incomeCashGet.loading
        || clicksGet.loading || levelGet.loading || incomeChartGet.loading
        || currentBannerGet.loading || overlayUrlGet.loading) ? (
          <DashboardLoading />
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
              {!contractionGet.loading && contractionGet.data
                && Boolean(contractionGet.data.creatorContractionAgreement)
                && (
                  <Hidden smDown>
                    <GridItem xs={12} md={12} lg={6}>
                      <AlertCard />
                    </GridItem>
                    <GridItem lg={6} />
                  </Hidden>
                )}

              {/* 온애드 시작 가이드 */}
              <GridItem xs={12} lg={6}>
                {!overlayUrlGet.loading && overlayUrlGet.data && (
                <StartGuideCard
                  doContractionDataRequest={contractionGet.doGetRequest}
                  overlayUrlData={overlayUrlGet.data}
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
                {!incomeCashGet.loading && incomeCashGet.data && (
                <UserInfoCard
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
              <GridItem xs={12} sm={6}>
                {!incomeChartGet.loading && (
                <BannerCard
                  currentBannerData={currentBannerGet.data ? currentBannerGet.data : []}
                />
                )}
              </GridItem>

              {/* 클릭광고 카드 */}
              <GridItem xs={12} sm={6}>
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
              <GridItem xs={12} sm={3}>
                <CustomerServiceCard />
              </GridItem>

              {/* 이벤트 알림 카드 */}
              <GridItem xs={12} sm={3}>
                <EventInfoCard />
              </GridItem>

            </GridContainer>
          )}
      </div>

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
