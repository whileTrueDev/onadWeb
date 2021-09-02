// material-UI
import {
  Checkbox,
  Dialog,
  DialogProps,
  FormControlLabel,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
// 내부 소스
// 프로젝트 내부 모듈
import * as React from 'react';
// 컴포넌트
// util 계열
// 스타일

const useStyles = makeStyles(theme => ({
  img: {
    height: '100%',
    minWidth: '100%',
    overflowX: 'hidden',
    position: 'relative',
  },
  container: {
    padding: theme.spacing(0, 2, 2),
    textAlign: 'center',
    color: theme.palette.common.white,
  },
  closeButton: { textAlign: 'right', zIndex: 10 },
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

interface EventPopupProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundImg: string;
  noShowKey: string;
  maxWidth?: DialogProps['maxWidth'];
  disableCloseButton?: boolean;
  disableFullWidth?: boolean;
}

export default function EventPopup({
  open,
  onClose,
  children,
  backgroundImg,
  maxWidth = 'xs',
  noShowKey,
  disableCloseButton = false,
  disableFullWidth = false,
}: EventPopupProps): React.ReactElement {
  const classes = useStyles();
  function handleNoShowCheck(): void {
    onClose();
    localStorage.setItem(noShowKey, new Date().toString());
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={!disableFullWidth}>
      <div
        className={classes.img}
        style={{ background: `no-repeat center url(${backgroundImg})`, backgroundSize: 'cover' }}
      >
        {!disableCloseButton && (
          <div className={classes.closeButton}>
            <IconButton className={classes.closeIcon} onClick={onClose}>
              <Close />
            </IconButton>
          </div>
        )}

        {children}

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
      </div>
    </Dialog>
  );
}
