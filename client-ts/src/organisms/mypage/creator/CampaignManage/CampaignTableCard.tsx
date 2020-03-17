import React, { useState } from 'react';
// components
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import CampaignTable, { CampaignTableData } from './sub/CampaignTable';
import BanCheckDialog from './sub/BanCheckDialog';
// utils
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useDialog from '../../../../utils/hooks/useDialog';

const CampaignTableCard = (): JSX.Element => {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignTableData | null>(null);
  function handleCampaignSelect(campaign: CampaignTableData): void {
    setSelectedCampaign(campaign);
  }
  // 이 배너광고 그만하기 다이얼로그를 위한 상태값
  const banDialog = useDialog();
  // 캠페인목록을 조회하기 위한 객체
  const campaignTableGet = useGetRequest<null, CampaignTableData[]>('/creator/banner/list');
  // 배너광고 그만하기 성공시 스낵바
  const banSuccessSnack = useDialog();

  return (
    <>
      <CustomCard iconComponent={<StyledItemText primary="내 배너광고 목록" color="white" />}>
        <div>
          {campaignTableGet.loading && (<CircularProgress small />)}
          {!campaignTableGet.loading && !campaignTableGet.error
          && campaignTableGet.data && (
          <CampaignTable
            tableData={campaignTableGet.data}
            handleDialogOpen={banDialog.handleOpen}
            handleCampaignSelect={handleCampaignSelect}
          />
          )}

          {selectedCampaign && (
          <BanCheckDialog
            open={banDialog.open}
            handleDialogClose={banDialog.handleClose}
            campaign={selectedCampaign}
            handleSnackOpen={banSuccessSnack.handleOpen}
            doCampaignGetRequest={campaignTableGet.doGetRequest}
          />
          )}
        </div>
      </CustomCard>
      <Snackbar
        open={banSuccessSnack.open}
        message="배너광고 거절이 성공하였습니다."
        color="success"
        onClose={banSuccessSnack.handleClose}
      />
    </>
  );
};

export default CampaignTableCard;
