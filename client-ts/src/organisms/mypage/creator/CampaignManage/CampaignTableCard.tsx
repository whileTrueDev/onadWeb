import React, { useState } from 'react';
// components
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import CampaignTable, { CampaignTableData } from './sub/CampaignTable';
import BanCheckDialog from './sub/BanCheckDialog';
// hook
import useDialog from '../../../../utils/hooks/useDialog';

interface CampaignTableCardProps {
  campaignTableData: CampaignTableData[];
  doCampaignTableDataRequest: () => void;
  handleSnackOpen: () => void;
}
const CampaignTableCard = ({
  campaignTableData,
  doCampaignTableDataRequest,
  handleSnackOpen
}: CampaignTableCardProps): JSX.Element => {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignTableData | null>(null);
  function handleCampaignSelect(campaign: CampaignTableData): void {
    setSelectedCampaign(campaign);
  }
  // 이 배너광고 그만하기 다이얼로그를 위한 상태값
  const banDialog = useDialog();

  return (
    <CustomCard iconComponent={<StyledItemText primary="내 배너광고 목록" color="white" />}>
      <div>
        <CampaignTable
          tableData={campaignTableData}
          handleDialogOpen={banDialog.handleOpen}
          handleCampaignSelect={handleCampaignSelect}
        />

        {selectedCampaign && (
          <BanCheckDialog
            open={banDialog.open}
            handleDialogClose={banDialog.handleClose}
            campaign={selectedCampaign}
            handleSnackOpen={handleSnackOpen}
            doCampaignGetRequest={doCampaignTableDataRequest}
          />
        )}
      </div>
    </CustomCard>
  );
};

export default CampaignTableCard;
