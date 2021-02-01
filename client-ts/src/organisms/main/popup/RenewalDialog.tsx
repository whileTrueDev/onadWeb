import {
  Button, Checkbox, Dialog, FormControlLabel, IconButton, makeStyles, Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  img: {
    height: 650,
    width: 350,
    minWidth: 320,
    background: 'no-repeat center url(/pngs/renewal/renewal_popup_image.svg)',
    backgroundSize: 'cover'
  },
  closeButton: { textAlign: 'right', },
  closeIcon: { color: theme.palette.common.white },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    height: 560,
  },
  button: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(3),
    boxShadow: theme.shadows[3],
    '&:hover': { boxShadow: theme.shadows[6], }
  },
  checkbox: {
    color: theme.palette.common.white
  }
}));

export interface RenewalDialogProps {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}
export default function RenewalDialog({
  open,
  onClose,
  onClick,
}: RenewalDialogProps): JSX.Element {
  const classes = useStyles();


  function handleNoShowCheck(): void {
    onClose();
    localStorage.setItem('renewal-popup-no-show', new Date().toString());
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <div className={classes.img}>
        <div className={classes.closeButton}>
          <IconButton className={classes.closeIcon} onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        <div className={classes.buttonContainer}>
          <FormControlLabel
            className={classes.checkbox}
            control={(
              <Checkbox
                name="checkedB"
                size="small"
                className={classes.checkbox}
                onChange={handleNoShowCheck}
              />
            )}
            label={<Typography variant="body2">오늘 하루 열지 않기</Typography>}
          />
          <Button
            className={classes.button}
            variant="contained"
            size="medium"
            onClick={() => {
              onClose();
              onClick();
            }}
          >
            통합로그인하기 &gt;
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
