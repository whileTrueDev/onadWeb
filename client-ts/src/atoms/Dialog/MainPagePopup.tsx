import {
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import * as React from 'react';

const useStyles = makeStyles(theme => ({
  img: {
    height: '100%',
    minWidth: '100%',
    background: 'no-repeat center',
    backgroundSize: 'cover',
    overflowX: 'hidden',
  },
  container: {
    padding: theme.spacing(0, 2, 2),
    textAlign: 'center',
    color: theme.palette.common.white,
  },
  closeButton: { textAlign: 'right' },
  closeIcon: { color: theme.palette.common.white },
  checkboxContainer: {
    textAlign: 'right',
    backgroundColor: theme.palette.common.white,
  },
  checkbox: {
    color: theme.palette.common.black,
    margin: 0,
  },
}));

export interface RenewalDialogProps {
  open: boolean;
  onClose: () => void;
  backgroundImage: string;
  children: React.ReactNode;
}
export default function RenewalDialog({
  open,
  onClose,
  backgroundImage = 'url(/pngs/main-popup/popup_background.png)',
  children,
}: RenewalDialogProps): JSX.Element {
  const classes = useStyles();

  function handleNoShowCheck(): void {
    onClose();
    localStorage.setItem('renewal-popup-no-show', new Date().toString());
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <div className={classes.img} style={{ backgroundImage }}>
        <div className={classes.closeButton}>
          <IconButton className={classes.closeIcon} onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        {children}
      </div>

      <div className={classes.checkboxContainer}>
        <FormControlLabel
          className={classes.checkbox}
          labelPlacement="start"
          control={
            <Checkbox
              name="checkedB"
              size="small"
              className={classes.checkbox}
              onChange={handleNoShowCheck}
            />
          }
          label={<Typography variant="body2">하루 동안 열지 않기</Typography>}
        />
      </div>
    </Dialog>
  );
}
