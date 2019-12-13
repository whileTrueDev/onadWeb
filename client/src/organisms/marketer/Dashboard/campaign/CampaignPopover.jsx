import React from 'react';
import {
  List, Popover, ListItem, Typography
} from '@material-ui/core';
import { Assessment, Delete as DeleteIcon } from '@material-ui/icons';

export default function CampaignPopover(props) {
  const {
    anchorEl, handleClose, handleDeleteDialogOpen,
    handleCampaignReportOpen, selectedCampaign
  } = props;
  return (
    <Popover
      id="campaign-menu"
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <List>
        <ListItem
          button
          onClick={() => {
          // Open Analysis page
            handleCampaignReportOpen();
            // Close the menu popover
            handleClose();
          }}
        >
          <Assessment />
          <Typography>분석</Typography>
        </ListItem>
        <ListItem
          button
          onClick={() => {
          // Open delete confirm dialog
            handleDeleteDialogOpen(selectedCampaign.campaignId);
            // Close the menu popover
            handleClose();
          }}
        >
          <DeleteIcon color="error" />
          <Typography color="error">삭제</Typography>
        </ListItem>
      </List>
    </Popover>
  );
}
