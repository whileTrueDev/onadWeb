import React from 'react';
// atoms
import { Hidden } from '@material-ui/core';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
// organisms
import ContractionCard, { ContractionDataType } from '../../../organisms/mypage/creator/Dashboard/ContractionCard';
import NotificationCard from '../../../organisms/mypage/creator/Dashboard/NotificationCard';
import IncomeCard, { IncomeCashRes } from '../../../organisms/mypage/creator/Dashboard/IncomeCard';
import AdPageCard, { AdPageRes } from '../../../organisms/mypage/creator/Dashboard/AdPageCard';
import IncomeChart, { IncomeChartData, IncomeChartParams } from '../../../organisms/mypage/creator/Dashboard/IncomeChart';
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
  const adPageGet = useGetRequest<null, AdPageRes>('/creator/ad-page');
  // 수익금 차트 정보 조회
  const incomeChartGet = useGetRequest<IncomeChartParams, IncomeChartData[]>(
    '/creator/income/chart', { dateRange: '30' }
  );
  // 현재 송출중 배너 정보 조회
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  // 배너 송출 URL 정보 조회
  const overlayUrlGet = useGetRequest<null, OverlayUrlRes>('/creator/banner/overlay');
  const snack = useDialog(); // 오버레이 url 복사 성공 알림 스낵바를 위한 객체

  return (
    <>
      {(contractionGet.loading || incomeCashGet.loading
        || adPageGet.loading || incomeChartGet.loading
        || currentBannerGet.loading || overlayUrlGet.loading) ? (
          <DashboardLoading />
        ) : (
          <GridContainer direction="row">
            {/* 크리에이터 계약 */}
            <GridItem sm={12} xl={10}>
              {!contractionGet.loading && contractionGet.data && (
              <ContractionCard
                contractionData={contractionGet.data}
                doContractionDataRequest={contractionGet.doGetRequest}
              />
              )}
            </GridItem>

            {/* 배너 권장 크기 및 무효화 공지 */}
            <Hidden smDown>
              <GridItem sm={12} xl={9}>
                <NotificationCard />
              </GridItem>
            </Hidden>

            <Hidden lgDown>
              <GridItem xl={3} />
            </Hidden>

            <GridItem xs={12} xl={3}>
              <GridContainer>

                {/* 수익금 카드 */}
                <GridItem xs={12} md={6} xl={12}>
                  {!incomeCashGet.loading && incomeCashGet.data && (
                  <IncomeCard incomeData={incomeCashGet.data} />
                  )}
                </GridItem>

                {/* 광고페이지 카드 */}
                <GridItem xs={12} md={6} xl={12}>
                  {!adPageGet.loading && adPageGet.data && (
                  <AdPageCard adPageData={adPageGet.data} />
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
              <BannerCard currentBannerData={currentBannerGet.data ? currentBannerGet.data : []} />
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
