import React, { useState } from 'react';
// material ui
import { Typography } from '@material-ui/core';
// components
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
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
  const banDialog = useDialog();

  const campaignTableGet = useGetRequest<null, CampaignTableData[]>('/creator/banner/list');

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6">배너 내역</Typography>
      </CardHeader>
      <CardBody>
        {campaignTableGet.loading && (<CircularProgress small />)}
        {!campaignTableGet.loading && !campaignTableGet.error
        && campaignTableGet.data && (
          <CampaignTable
            tableData={campaignTableGet.data}
            handleDialogOpen={banDialog.handleOpen}
            handleCampaignSelect={handleCampaignSelect}
          />
        )}
        <BanCheckDialog
          open={banDialog.open}
          handleClose={banDialog.handleClose}
          campaign={selectedCampaign}
        />
      </CardBody>
    </Card>
  );
};

export default CampaignTableCard;
