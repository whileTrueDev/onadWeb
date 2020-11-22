import React, { useState } from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import useGetRequest from '../../../utils/hooks/useGetRequest';
import useDialog from '../../../utils/hooks/useDialog';
// organisms
import CPACampaigns from '../../../organisms/mypage/creator/CPAManage/CPACampaigns';
import CPAIncomeTableDialog from '../../../organisms/mypage/creator/CPAManage/CPAIncomeTableDialog';
import CPAConfirmDialog from '../../../organisms/mypage/creator/CPAManage/CPAConfirmDialog';
import CPACampaignsLoading from '../../../organisms/mypage/creator/CPAManage/CPACampaigns.loading';
import CPAAgreement from '../../../organisms/mypage/creator/CPAManage/CPAAgreement';
import CPAIndicator from '../../../organisms/mypage/creator/CPAManage/CPAIndicator';
import AgreementContentDialog from '../../../organisms/mypage/creator/CPAManage/AgreementContentDialog';
import MainIndicatorLoading from '../../../organisms/mypage/creator/CPAManage/sub/MainIndicator.loading';
import HowToCPADialog from '../../../organisms/mypage/creator/CPAManage/HowToCPADialog';
// source
import textsource from '../../../organisms/mypage/creator/CPAManage/source/AgreementText';
// types
import { CampaignResult, AdPickIncome, AdPickMetrics } from '../../../organisms/mypage/creator/CPAManage/AdpickTypes';
import CPAIntroduction from '../../../organisms/mypage/creator/CPAManage/CPAIntroduction';

export interface ContractionDataType {
  creatorId: string;
  creatorName: string;
  creatorIp: string;
  creatorMail: string;
  creatorAccountNumber: string;
  creatorContractionAgreement: number;
  creatorTwitchId: string;
  realName: string;
  creatorLogo: string;
  NowIp: string;
  CPAAgreement: number;
  settlementState: number;
}
export default function CPAManage(): JSX.Element {
  const contractionGet = useGetRequest<null, ContractionDataType>('/creator');
  const CPAmainData = useGetRequest<null, AdPickMetrics>('/creator/cpa/adpick/mainIndicator');
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

  // 유의사항 dialog
  const agreementDialog = useDialog();

  // 상세 수익정보 dialog
  const incomeTableDialog = useDialog();

  // 광고 시작 방법 dialog
  const howToCPADialog = useDialog();


  return (
    <div style={{ margin: '0px auto', maxWidth: 1430 }}>

      {/* 설명 */}
      <GridContainer>
        <GridItem xs={12}>
          <CPAIntroduction />
        </GridItem>
      </GridContainer>

      {!contractionGet.loading && contractionGet.data && (
        <>
          {/* 계약 진행하지 않은 경우와 진행한 경우 분기처리 */}
          {!contractionGet.data?.CPAAgreement
            ? (
              <GridContainer>
                <GridItem xs={12}>
                  {/* 광고페이지 유의사항 및 동의 */}
                  <CPAAgreement callback={contractionGet.doGetRequest} />
                </GridItem>
              </GridContainer>
            ) : (
              <>
                {/* 지표 indicator */}
                {CPAmainData.loading && (<MainIndicatorLoading />)}
                {!CPAmainData.loading && CPAmainData.data && (
                <GridContainer>
                  <GridItem xs={12}>
                    <CPAIndicator
                      CPAmainData={CPAmainData.data}
                      handleIncomeTableDialogOpen={incomeTableDialog.handleOpen}
                      handleAgreementDialogOpen={agreementDialog.handleOpen}
                      handleHowToCPADialogOpen={howToCPADialog.handleOpen}
                      callback={contractionGet.doGetRequest}
                    />
                  </GridItem>
                </GridContainer>
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
                  callback={(): void => {
                    getAdpickCampaigns.doGetRequest();
                    startDialog.handleClose();
                  }}
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
                  callback={(): void => {
                    getAdpickCampaigns.doGetRequest();
                    stopDialog.handleClose();
                  }}
                  selectedCampaign={selectedCampaign}
                />
                )}

                {/* 유의사항 다이얼로그 */}
                <AgreementContentDialog changeHandle={agreementDialog} source={textsource} />

                {/* CPA 수익내역 다이얼로그 */}
                {!getAdpickCampaigns.loading && getAdpickCampaigns.data
                  && !getCampaignIncomes.loading
                  && (
                    <CPAIncomeTableDialog
                      open={incomeTableDialog.open}
                      handleClose={incomeTableDialog.handleClose}
                      campaigns={getAdpickCampaigns.data}
                      campaignIncomes={getCampaignIncomes.data}
                    />
                  )}

                {/* CPA광고 시작 방법 다이얼로그 */}
                {!CPAmainData.loading && CPAmainData.data && (
                <HowToCPADialog
                  open={howToCPADialog.open}
                  handleClose={howToCPADialog.handleClose}
                  CPAmainData={CPAmainData.data}
                />
                )}

              </>
            )}
        </>
      )}

    </div>
  );
}
