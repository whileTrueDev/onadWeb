
import { makeStyles, Popover, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  tooltip: { padding: theme.spacing(4), maxWidth: 300, textAlign: 'center' },
}));
export interface SettlementDescPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}
export default function SettlementDescPopover({
  open,
  onClose,
  anchorEl,
}: SettlementDescPopoverProps): JSX.Element {
  const classes = useStyles();
  return (
    <Popover
      disableScrollLock
      id="mouse-over-popover"
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      <div className={classes.tooltip}>
        <Typography variant="body2" color="primary">
          정산 등록은
        </Typography>
        <Typography variant="body2">
          수익금 출금을 위해서 꼭 필요한 절차로,
        </Typography>
        <Typography variant="body2">
          몇 가지 세금처리 관련 정보를
        </Typography>
        <Typography variant="body2">
          온애드에 제출하는 절차입니다.
        </Typography>
      </div>
    </Popover>
  );
}
