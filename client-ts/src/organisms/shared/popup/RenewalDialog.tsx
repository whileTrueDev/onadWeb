import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles(theme => ({
  img: {
    height: '100%',
    minWidth: '100%',
    background: 'no-repeat center url(/pngs/renewal/popup_background.jpg)',
    backgroundSize: 'cover',
  },
  container: {
    padding: theme.spacing(0, 2, 2),
    textAlign: 'center',
    color: theme.palette.common.white,
  },
  title: {
    fontWeight: 'bold',
    color: '#DDF6FF', // 일시적으로 사용되는 색상이므로, 하드코딩
  },
  helperText: {
    color: '#FFD7F2', // 일시적으로 사용되는 색상이므로, 하드코딩
  },
  closeButton: { textAlign: 'right' },
  closeIcon: { color: theme.palette.common.white },
  buttonSet: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  button: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(3),
    boxShadow: theme.shadows[3],
    '&:hover': { boxShadow: theme.shadows[6] },
  },
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
  onClick: () => void;
}
export default function RenewalDialog({ open, onClose, onClick }: RenewalDialogProps): JSX.Element {
  const classes = useStyles();

  function handleNoShowCheck(): void {
    onClose();
    localStorage.setItem('renewal-popup-no-show', new Date().toString());
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <div className={classes.img}>
        <div className={classes.closeButton}>
          <IconButton className={classes.closeIcon} onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        <div className={classes.container}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/pngs/logo/renewal/1x/logo_onad_text_w.png" alt="" height={95} />
            <Typography variant="h4" className={classes.title} style={{ marginLeft: -8 }}>
              가
            </Typography>
          </div>
          <Typography variant="h4" className={classes.title} style={{ marginTop: -24 }}>
            새로워졌습니다
          </Typography>

          <br />
          <br />

          <Typography variant="h5" className={classes.title}>
            리모컨 기능
          </Typography>
          <Typography>매칭된 광고를 한눈에 볼 수 있고</Typography>
          <Typography>실시간으로 광고를 ON/OFF할 수 있습니다.</Typography>

          <br />

          <Typography variant="h5" className={classes.title}>
            아프리카 TV 연동
          </Typography>
          <Typography>이제 아프리카TV도 연동하여</Typography>
          <Typography>광고를 송출할 수 있습니다.</Typography>

          <br />

          <Typography variant="h5" className={classes.title}>
            통합 로그인
          </Typography>
          <Typography>통합된 온애드 계정으로</Typography>
          <Typography>여러 방송 플랫폼을 연동할 수 있습니다.</Typography>

          <br />
          <div className={classes.buttonSet}>
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

            <br />
            <br />

            <Typography className={classes.helperText}>
              * 기존 회원분들도 계정생성을 해야 합니다.
            </Typography>
          </div>
        </div>
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
