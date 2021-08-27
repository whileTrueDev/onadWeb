import { Fade, Menu, MenuItem, Typography } from '@material-ui/core';
import { Build, Delete } from '@material-ui/icons';

export interface CampaignInventoryMenuPopoverProps {
  open: boolean;
  anchorEl: HTMLElement;
  onClose: () => void;
  handleDeleteDialogOpen: () => void;
  handleUpdateDialogOpen: () => void;
}
export default function CampaignInventoryMenuPopover({
  open,
  anchorEl,
  onClose,
  handleDeleteDialogOpen,
  handleUpdateDialogOpen,
}: CampaignInventoryMenuPopoverProps): JSX.Element {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={handleUpdateDialogOpen}>
        <Typography gutterBottom>
          <Build fontSize="small" />
          수정
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleDeleteDialogOpen}>
        <Typography color="error" gutterBottom>
          <Delete fontSize="small" />
          삭제
        </Typography>
      </MenuItem>
    </Menu>
  );
}
