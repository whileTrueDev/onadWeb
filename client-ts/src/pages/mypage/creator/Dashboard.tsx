import React from 'react';
// atoms
import { Hidden, Button, } from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
// organisms
import ContractionCard, { ContractionDataType } from '../../../organisms/mypage/creator/Dashboard/ContractionCard';
import NotificationCard from '../../../organisms/mypage/creator/Dashboard/NotificationCard';
import IncomeCard, { IncomeCashRes } from '../../../organisms/mypage/creator/Dashboard/IncomeCard';
import WithdrawalDialog from '../../../organisms/mypage/creator/Dashboard/WithdrawalDialog';
import AdPageCard, { ClicksRes, LevelRes } from '../../../organisms/mypage/creator/Dashboard/AdPageCard';
import IncomeChart, {
  IncomeChartData, IncomeChartParams
} from '../../../organisms/mypage/creator/Dashboard/IncomeChart';
import BannerCard, { CurrentBannerRes } from '../../../organisms/mypage/creator/Dashboard/BannerCard';
import UrlCard, { OverlayUrlRes } from '../../../organisms/mypage/creator/Dashboard/OverlayUrlCard';
import DashboardLoading from './Dashboard.loading';
// hooks
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useDialog from '../../../utils/hooks/useDialog';

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
      {(contractionGet.loading || incomeCashGet.loading
        || clicksGet.loading || levelGet.loading || incomeChartGet.loading
        || currentBannerGet.loading || overlayUrlGet.loading) ? (
          <DashboardLoading />
        ) : (
          <GridContainer direction="row">

            {(incomeCashGet.data && incomeCashGet.data.creatorAccountNumber) && (
            <Button
              color="primary"
              onClick={(): void => { handleOpen(); }}
            >
              출금신청
            </Button>
            )}

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
            {/* 크리에이터 계약 */}
            <GridItem sm={12} xl={10}>
              {!contractionGet.loading && contractionGet.data
              && !contractionGet.data.creatorContractionAgreement && (
                <ContractionCard
                  contractionData={contractionGet.data}
                  doContractionDataRequest={contractionGet.doGetRequest}
                />
              )}
            </GridItem>

            {/* 배너 권장 크기 및 무효화 공지 */}
            <Hidden smDown>
              <NotificationCard />
            </Hidden>

            <GridItem xs={12} lg={6}>
              <GridContainer>
                {/* 수익금 카드 */}
                <GridItem xs={12}>
                  {!incomeCashGet.loading && incomeCashGet.data && (
                    <IncomeCard incomeData={incomeCashGet.data} />
                  )}
                </GridItem>

                {/* 광고페이지 카드 */}
                <GridItem xs={12}>
                  {!levelGet.loading && levelGet.data && !clicksGet.loading && clicksGet.data && (
                    <AdPageCard levelData={levelGet.data} clicksData={clicksGet.data} />
                  )}
                </GridItem>
              </GridContainer>
            </GridItem>

            {/* 수익금 차트 */}
            <GridItem xs={12} xl={6}>
              {!incomeChartGet.loading && (
                <IncomeChart incomeChartData={incomeChartGet.data ? incomeChartGet.data : []} />
              )}
            </GridItem>

            {/* 현재 송출중 배너 카드 */}
            <GridItem xs={12} sm={6} lg={4}>
              {!incomeChartGet.loading && (
                <BannerCard
                  currentBannerData={currentBannerGet.data ? currentBannerGet.data : []}
                />
              )}
            </GridItem>

            {/* 배너 광고 송출 URL */}
            <GridItem xs={12} sm={6} lg={4}>
              {!overlayUrlGet.loading && overlayUrlGet.data && (
                <UrlCard overlayUrlData={overlayUrlGet.data} handleSnackOpen={snack.handleOpen} />
              )}
            </GridItem>

            <GridItem xs={12} sm={1} xl={2} />
          </GridContainer>
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
