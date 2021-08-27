// atoms
import { Hidden } from '@material-ui/core';
import { useState } from 'react';
import { useRouter } from 'next/router';
import GridContainer from '../../../atoms/grid/gridContainer';
import GridItem from '../../../atoms/grid/gridItem';
import AlertCard from '../../../components/mypage/creator/main/alertCard';
import BannerCard from '../../../components/mypage/creator/main/bannerCard';
import ClickAdCard from '../../../components/mypage/creator/main/clickAdCard';
import CustomerServiceCard from '../../../components/mypage/creator/main/customerServiceCard';
import EventInfoCard from '../../../components/mypage/creator/main/eventInfoCard';
import IncomeChart from '../../../components/mypage/creator/main/incomeChart';
import NoticeCard from '../../../components/mypage/creator/main/noticeCard';
import UserInfoCard from '../../../components/mypage/creator/main/userInfoCard';
import OverlayUrlCard from '../../../components/mypage/creator/shared/overlayUrlCard';
// organisms
import StartGuideCard from '../../../components/mypage/creator/shared/startGuideCard';
import WithdrawalDialog from '../../../components/mypage/creator/shared/withdrawalDialog';
import PlatformLinkDialog from '../../../components/mypage/shared/platformLinkDialog';
import { useCreatorBannerActive } from '../../../utils/hooks/query/useCreatorBannerActive';
import { useCreatorBannerOverlay } from '../../../utils/hooks/query/useCreatorBannerOverlay';
import { useCreatorClicks } from '../../../utils/hooks/query/useCreatorClicks';
import { useCreatorIncome } from '../../../utils/hooks/query/useCreatorIncome';
import { useCreatorProfile } from '../../../utils/hooks/query/useCreatorProfile';
import useDialog from '../../../utils/hooks/useDialog';
import MypageLoading from '../../../components/mypage/creator/main/dashboard.loading';
import DashboardLayout from '../../../components/mypage/layouts/creatorDashboardLayout';

const Dashboard = (): JSX.Element => {
  // 계약 정보 조회
  const profile = useCreatorProfile();
  // 배너 송출 URL 정보 조회
  const overlayUrl = useCreatorBannerOverlay();
  // 수익금 정보 조회
  const income = useCreatorIncome();
  // 광고페이지 정보 조회
  const clicks = useCreatorClicks();
  // 현재 송출중 배너 정보 조회
  const currentBanner = useCreatorBannerActive();
  // 채널 연동 유도 다이얼로그
  const platformLinkDialog = useDialog();

  const router = useRouter();

  // 출금 신청 다이얼로그
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    if (income.data && !(income.data.settlementState === 2)) {
      alert('정산등록 신청이 승인되지 않았습니다. 내 수익 관리 탭에서 정산 등록을 진행해주세요.');
      router.push('/mypage/creator/income');
    } else {
      setOpen(true);
    }
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <div style={{ margin: '0 auto', maxWidth: 1430 }}>
        {profile.isLoading ||
        income.isLoading ||
        clicks.isLoading ||
        currentBanner.isLoading ||
        overlayUrl.isLoading ? (
          <MypageLoading />
        ) : (
          <GridContainer direction="row">
            {/* 출금신청 다이얼로그 */}
            {income.data &&
              Boolean(income.data.creatorContractionAgreement) &&
              income.data.creatorAccountNumber && (
                <WithdrawalDialog
                  open={open}
                  handleClose={handleClose}
                  realName={income.data.realName}
                  accountNumber={income.data.creatorAccountNumber}
                  receivable={income.data.creatorReceivable}
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
              <StartGuideCard />
            </GridItem>

            {/* 배너 광고 송출 URL */}
            <GridItem xs={12} lg={6}>
              {!overlayUrl.isLoading && overlayUrl.data && (
                <OverlayUrlCard overlayUrlData={overlayUrl.data} />
              )}
            </GridItem>

            {/* 유저 정보 및 수익금 카드 */}
            <GridItem xs={12} lg={6}>
              {!profile.isLoading && profile.data && (
                <UserInfoCard handleWithdrawalDialogOpen={handleOpen} />
              )}
            </GridItem>

            {/* 수익금 차트 카드 */}
            <GridItem xs={12} lg={6}>
              <IncomeChart />
            </GridItem>

            {/* 현재 송출중 배너 카드 */}
            <GridItem xs={12} lg={6}>
              <BannerCard />
            </GridItem>

            {/* 클릭광고 카드 */}
            <GridItem xs={12} lg={6}>
              <ClickAdCard />
            </GridItem>

            {/* 공지사항 카드 */}
            <GridItem xs={12} sm={6}>
              <NoticeCard />
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

Dashboard.layout = DashboardLayout;
