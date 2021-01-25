import moment from 'moment';
import {
  Paper, Popover, Typography,
} from '@material-ui/core';
import React from 'react';
import { CampaignInterface } from '../../dashboard/interfaces';

export interface BannerInfoPopoverProps {
  open: boolean;
  anchorEl: HTMLElement;
  onClose: () => void;
  selectedCampaign: CampaignInterface;
}
export default function BannerInfoPopover({
  open,
  anchorEl,
  onClose,
  selectedCampaign
}: BannerInfoPopoverProps): JSX.Element {
  function renderConfirmState(state: number): string {
    const states = ['진행중', '승인됨', '거절됨'];
    return states[state];
  }

  return (
    <Popover
      anchorOrigin={{
        vertical: 'bottom', horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top', horizontal: 'left',
      }}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <Paper style={{ padding: 16, minWidth: 350, minHeight: 200 }}>
        <div>
          <img src={selectedCampaign.bannerSrc} alt="" width="320" height="160" />
          <Typography variant="body2">
            {`배너 이름: ${selectedCampaign.bannerId}`}
          </Typography>
          <Typography variant="body2">
            {`심의 상태: ${renderConfirmState(selectedCampaign.confirmState)}`}
          </Typography>
          <Typography variant="body2">
            {`생성 날짜: ${moment(selectedCampaign.bannerRegiDate).format('YYYY/MM/DD HH:mm:ss')}`}
          </Typography>
        </div>
      </Paper>
    </Popover>
  );
}
