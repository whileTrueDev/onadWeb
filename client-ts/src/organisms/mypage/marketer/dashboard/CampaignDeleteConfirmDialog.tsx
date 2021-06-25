import React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import useDeleteRequest from '../../../../utils/hooks/useDeleteRequest';
import { CampaignInterface } from './interfaces';

interface CampaignDeleteConfirmDialogProps {
  open: boolean;
  selectedCampaign: CampaignInterface;
  handleClose: () => void;
  doGetRequest: () => void;
}

export default function CampaignDeleteConfirmDialog(
  props: CampaignDeleteConfirmDialogProps,
): JSX.Element {
  const { open, handleClose, doGetRequest, selectedCampaign } = props;
  const { doDeleteRequest } = useDeleteRequest('/marketer/campaign', doGetRequest);

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      buttons={
        <div>
          <Button
            color="primary"
            onClick={(): void => {
              doDeleteRequest({ campaignId: selectedCampaign.campaignId });
              handleClose();
            }}
          >
            삭제
          </Button>
          <Button onClick={handleClose}>취소</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">해당 캠페인을 삭제하시겠습니까?</Typography>
        </div>
        <div>
          <Typography variant="body1">삭제시, 진행중이던 광고는 모두 중지됩니다.</Typography>
        </div>
      </div>
    </Dialog>
  );
}
