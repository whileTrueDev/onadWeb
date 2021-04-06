import React from 'react';
import {
  Dialog, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import DaumPostCode, { AddressData } from 'react-daum-postcode';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(1, 2),
  }
}));
export interface DaumPostCodeDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: AddressData) => void;
}
export default function DaumPostCodeDialog({
  open,
  onClose,
  onComplete
}: DaumPostCodeDialogProps): JSX.Element {
  const classes = useStyles();
  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <div className={classes.title}>
        <Typography variant="h6">
          주소 찾기
        </Typography>
        <IconButton onClick={onClose} color="inherit">
          <Close />
        </IconButton>
      </div>
      <DaumPostCode onComplete={onComplete} />
    </Dialog>
  );
}
