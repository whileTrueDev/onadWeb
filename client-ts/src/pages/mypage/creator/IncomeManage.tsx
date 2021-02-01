import React from 'react';

import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import WithdrawalCard from '../../../organisms/mypage/creator/IncomeManage/WithdrawalCard';
import SettlementCard from '../../../organisms/mypage/creator/IncomeManage/SettlementCard';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import { IncomeCashRes } from '../../../organisms/mypage/creator/Dashboard/UserInfoCard';
import AdIncomeCard from '../../../organisms/mypage/creator/shared/AdIncomeCard';
import { useAnchorEl } from '../../../utils/hooks';
import SettlementDescPopover from '../../../organisms/mypage/creator/IncomeManage/SettlementDescPopover';
import SummaryCard from '../../../organisms/mypage/creator/IncomeManage/SummaryCard';
import { ProfileDataType } from '../../../organisms/mypage/creator/Mypage/ProfileData.type';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import WithdrawalRequestCard from '../../../organisms/mypage/creator/IncomeManage/WithdrawalRequestCard';
import WithdrawDialog from '../../../organisms/mypage/creator/Dashboard/WithdrawalDialog';


export default function IncomeManage(): JSX.Element {
  // 프로필 유저 데이터
  const profileData = useGetRequest<null, ProfileDataType>('/creator');
  // 수익금 정보 조회
  const incomeCashGet = useGetRequest<null, IncomeCashRes>('/creator/income');
  // 출금 내역 데이터
  const withdrawalData = useGetRequest('/creator/income/withdrawal');

  // 설명 anchor 
  const descAnchor = useAnchorEl();

  // 출금 신청 다이얼로그
  const [open, setOpen] = React.useState(false);
  const handleDialogOpen = (): void => {
    if (incomeCashGet.data && !(incomeCashGet.data.settlementState === 2)) {
      alert('정산등록 신청이 승인되지 않았습니다. 내 수익 관리 탭에서 정산 등록을 진행해주세요.');
    } else {
      setOpen(true);
    }
  };
  const handleDialogClose = (): void => { setOpen(false); };

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer direction="row" spacing={1}>

        {/* 광고 수익 정보 */}
        <GridItem xs={12} lg={6}>
          <AdIncomeCard />
        </GridItem>

        {/* 수익금 정보 및 출금신청 */}
        <GridItem xs={12} lg={6}>
          <SummaryCard
            descAnchor={descAnchor.open}
            descAnchorOpen={descAnchor.handleAnchorOpen}
            profileData={profileData}
            incomeCashGet={incomeCashGet}
          />
        </GridItem>

        {/* 출금 신청 내역 */}
        <GridItem xs={12} lg={6}>
          {(profileData.loading || withdrawalData.loading) && (<CenterLoading />)}
          {!(profileData.loading || withdrawalData.loading) && (
            <div>
              <WithdrawalRequestCard handleDialogOpen={handleDialogOpen} />
              <WithdrawalCard withdrawalData={withdrawalData.data ? withdrawalData.data : []} />
            </div>
          )}
        </GridItem>

        {/* 정산 등록 */}
        <GridItem xs={12} lg={6}>
          {(profileData.loading || withdrawalData.loading) && (<CenterLoading />)}
          {!(profileData.loading || withdrawalData.loading) && profileData.data && (
          <SettlementCard profileData={profileData.data} />
          )}
        </GridItem>
      </GridContainer>

      {/* 정산등록이 무엇인지 알려주는 Popover */}
      <SettlementDescPopover
        open={descAnchor.open}
        anchorEl={descAnchor.anchorEl}
        onClose={descAnchor.handleAnchorClose}
      />

      {/* 출금신청 다이얼로그 */}
      {incomeCashGet.data && Boolean(incomeCashGet.data.creatorContractionAgreement)
        && incomeCashGet.data.creatorAccountNumber && (
          <WithdrawDialog
            open={open}
            handleClose={handleDialogClose}
            realName={incomeCashGet.data.realName}
            accountNumber={incomeCashGet.data.creatorAccountNumber}
            receivable={incomeCashGet.data.creatorReceivable}
          />
      )}
    </div>
  );
}
