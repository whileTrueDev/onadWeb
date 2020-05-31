import React, { useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useDialog from '../../../utils/hooks/useDialog';

import CPACampaigns from '../../../organisms/mypage/creator/CPAManage/CPACampaigns';
import CPAIncomeTable from '../../../organisms/mypage/creator/CPAManage/CPAIncomeTable';
import CPAConfirmDialog from '../../../organisms/mypage/creator/CPAManage/CPAConfirmDialog';
import CPACampaignsLoading from '../../../organisms/mypage/creator/CPAManage/CPACampaignsLoading';
// types
import { CampaignResult, AdPickIncome } from '../../../organisms/mypage/creator/CPAManage/AdpickTypes';

export default function CPAManage(): JSX.Element {
  const getAdpickCampaigns = useGetRequest<null, CampaignResult[]>('/creator/cpa/adpick/campaigns');
  const getCampaignIncomes = useGetRequest<null, AdPickIncome[]>('/creator/cpa/adpick/incomes');

  // 등록 / 제외를 위해 선택된 캠페인 state
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignResult | null>(null);
  // 등록 dialog
  const startDialog = useDialog();
  const handleStartDialogOpen = (item: CampaignResult) => (): void => {
    setSelectedCampaign(item);
    startDialog.handleOpen();
  };

  // 제외 dialog
  const stopDialog = useDialog();
  const handleStopDialogOpen = (item: CampaignResult) => (): void => {
    setSelectedCampaign(item);
    stopDialog.handleOpen();
  };


  return (
    <div style={{ margin: '0px auto', maxWidth: 1430 }}>
      {/* CPA 수익내역 테이블 */}
      {(getAdpickCampaigns.loading || getCampaignIncomes.loading) && (<Skeleton height={400} variant="text" />)}
      {!getAdpickCampaigns.loading
      && getAdpickCampaigns.data
      && !getCampaignIncomes.loading
      && getCampaignIncomes.data
      && getCampaignIncomes.data.length > 0
      && (
        <CPAIncomeTable campaigns={getAdpickCampaigns.data} campaignIncomes={getCampaignIncomes.data} />
      )}

      {/* 현재 가능한 CPA 캠페인 목록 */}
      {getAdpickCampaigns.loading && (<CPACampaignsLoading />)}
      {!getAdpickCampaigns.loading && getAdpickCampaigns.data
      && (
        <CPACampaigns
          campaigns={getAdpickCampaigns.data}
          onStartClick={handleStartDialogOpen}
          onStopClick={handleStopDialogOpen}
        />
      )}

      {/* 자신의 CPA페이지에 등록 확인 다이얼로그 */}
      {startDialog.open && selectedCampaign && (
        <CPAConfirmDialog
          type="등록"
          title={`${selectedCampaign.apAppTitle}`}
          open={startDialog.open}
          onClose={startDialog.handleClose}
          callback={(): void => { getAdpickCampaigns.doGetRequest(); startDialog.handleClose(); }}
          selectedCampaign={selectedCampaign}
        />
      )}

      {/* 자신의 CPA페이지에서 제외 확인 다이얼로그 */}
      {stopDialog.open && selectedCampaign && (
        <CPAConfirmDialog
          type="제외"
          title={`${selectedCampaign.apAppTitle}`}
          open={stopDialog.open}
          onClose={stopDialog.handleClose}
          callback={(): void => { getAdpickCampaigns.doGetRequest(); stopDialog.handleClose(); }}
          selectedCampaign={selectedCampaign}
        />
      )}

    </div>
  );
}
