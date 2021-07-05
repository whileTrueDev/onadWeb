import { useState } from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import SettlementCard from '../../../organisms/mypage/creator/IncomeManage/SettlementCard';
import SettlementDescPopover from '../../../organisms/mypage/creator/IncomeManage/SettlementDescPopover';
import SummaryCard from '../../../organisms/mypage/creator/IncomeManage/SummaryCard';
import WithdrawalCard from '../../../organisms/mypage/creator/IncomeManage/WithdrawalCard';
import WithdrawalRequestCard from '../../../organisms/mypage/creator/IncomeManage/WithdrawalRequestCard';
import AdIncomeCard from '../../../organisms/mypage/creator/shared/AdIncomeCard';
import WithdrawDialog from '../../../organisms/mypage/creator/shared/WithdrawalDialog';
import { useAnchorEl } from '../../../utils/hooks';
import { useCreatorIncome } from '../../../utils/hooks/query/useCreatorIncome';
import useMypageScrollToTop from '../../../utils/hooks/useMypageScrollToTop';

export default function IncomeManage(): JSX.Element {
  // 수익금 정보 조회
  const income = useCreatorIncome();

  // 설명 anchor
  const descAnchor = useAnchorEl();

  // 출금 신청 다이얼로그
  const [open, setOpen] = useState(false);
  const handleDialogOpen = (): void => {
    if (income.data && !(income.data.settlementState === 2)) {
      alert('정산등록 신청이 승인되지 않았습니다. 내 수익 관리 탭에서 정산 등록을 진행해주세요.');
    } else {
      setOpen(true);
    }
  };
  const handleDialogClose = (): void => {
    setOpen(false);
  };

  useMypageScrollToTop();
  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer direction="row" spacing={1}>
        {/* 광고 수익 정보 */}
        <GridItem xs={12} lg={6}>
          <AdIncomeCard />
        </GridItem>

        {/* 수익금 정보 및 출금신청 */}
        <GridItem xs={12} lg={6}>
          <SummaryCard descAnchor={descAnchor.open} descAnchorOpen={descAnchor.handleAnchorOpen} />
        </GridItem>

        {/* 출금 신청 내역 */}
        <GridItem xs={12} lg={6}>
          <WithdrawalRequestCard handleDialogOpen={handleDialogOpen} />
          <WithdrawalCard />
        </GridItem>

        {/* 정산 등록 */}
        <GridItem xs={12} lg={6}>
          <SettlementCard />
        </GridItem>
      </GridContainer>

      {/* 정산등록이 무엇인지 알려주는 Popover */}
      <SettlementDescPopover
        open={descAnchor.open}
        anchorEl={descAnchor.anchorEl}
        onClose={descAnchor.handleAnchorClose}
      />

      {/* 출금신청 다이얼로그 */}
      {income.data &&
        Boolean(income.data.creatorContractionAgreement) &&
        income.data.creatorAccountNumber && (
          <WithdrawDialog
            open={open}
            handleClose={handleDialogClose}
            realName={income.data.realName}
            accountNumber={income.data.creatorAccountNumber}
            receivable={income.data.creatorReceivable}
          />
        )}
    </div>
  );
}
