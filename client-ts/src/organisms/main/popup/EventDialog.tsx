import {
  Checkbox, Dialog, FormControlLabel, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  img: {
    height: '100%',
    minWidth: '100%',
    background: 'no-repeat center url(/pngs/main-popup/popup_background.png)',
    backgroundSize: 'cover',
    overflowX: 'hidden',
  },
  container: {
    padding: theme.spacing(0, 2, 2),
    textAlign: 'center',
    color: theme.palette.common.white
  },
  closeButton: { textAlign: 'right', },
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
}
export default function RenewalDialog({
  open,
  onClose,
}: RenewalDialogProps): JSX.Element {
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

        <div style={{
          position: 'absolute', left: -35, top: 40,
        }}
        >
          <img src="/pngs/main-popup/1.svg" alt="" width={90} />
        </div>
        <div style={{ position: 'absolute', left: -20, bottom: 230 }}>
          <img src="/pngs/main-popup/2.svg" alt="" width={90} />
        </div>
        <div style={{ position: 'absolute', right: 100, bottom: 30 }}>
          <img src="/pngs/main-popup/3.svg" alt="" width={90} />
        </div>

        <div style={{ padding: '0px 32px 32px' }}>
          <div style={{
            backgroundColor: 'white', boxShadow: '10px 5px 5px black', borderRadius: 12, textAlign: 'center'
          }}
          >
            <img src="/pngs/main-popup/event_logo.png" alt="" height={35} />
            <Typography variant="h6" style={{ fontWeight: 900 }}>
              온애드
              {' '}
              <Typography component="span" variant="h6" color="primary" style={{ fontWeight: 'bold' }}>
                아프리카TV 플랫폼
              </Typography>
              {' '}
              추가 이벤트
            </Typography>

            <Typography component="span" variant="body1" style={{ backgroundColor: 'rgba(44, 66, 125)', color: 'white', fontWeight: 'bold' }}>
              온애드를 주변 BJ분들에게 추천하여 많은 혜택을 받으세요!
            </Typography>

            <img src="/pngs/main-popup/event_description.png" alt="" width="100%" />

            <hr style={{
              height: 0, width: '70%', border: '2px dashed #ddd', marginTop: 16, marginBottom: 16
            }}
            />

            <Typography variant="body2" style={{ fontWeight: 'bold' }}>온애드에 가입할 때 추천인 코드를 작성하면</Typography>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              신규 가입자에게 온애드 수익금
              {' '}
              <Typography component="span" variant="body2" color="primary" style={{ fontWeight: 'bold' }}>
                5,000원
              </Typography>
              {' '}
             이 적립되며,
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>추천인 코드를 생성하여 동료 BJ에게 추천하여</Typography>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              추천받은 BJ가 신규가입 하면
              {' '}
              <Typography component="span" variant="body2" color="primary" style={{ fontWeight: 'bold' }}>
                5,000원이 추가 적립
              </Typography>
              됩니다.
            </Typography>

            <br />

            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              추천을 통해 최대
              {' '}
              <Typography component="span" variant="body2" style={{ fontWeight: 'bold', color: 'rgba(249, 159, 88)' }}>
                1만원까지
              </Typography>
              {' '}
              적립됩니다.
            </Typography>
            <br />

            <div style={{
              backgroundColor: 'rgba(231, 245, 255)', textAlign: 'start', padding: 32, borderRadius: '0px 0px 12px 12px'
            }}
            >
              <Typography variant="body2" style={{ fontWeight: 'bold' }}>- 신규가입자가 아닌, 기존 회원은 추천만 가능합니다.</Typography>
              <Typography variant="body2" style={{ fontWeight: 'bold' }}>- 온애드 계정 생성 후,</Typography>
              <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                &nbsp;&nbsp;
                <Typography component="span" variant="body2" color="error" style={{ fontWeight: 'bold' }}>
                  아프리카TV 연동
                </Typography>
                을 하셔야 혜택이 주어집니다.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.checkboxContainer}>
        <FormControlLabel
          className={classes.checkbox}
          labelPlacement="start"
          control={(
            <Checkbox
              name="checkedB"
              size="small"
              className={classes.checkbox}
              onChange={handleNoShowCheck}
            />
            )}
          label={<Typography variant="body2">하루 동안 열지 않기</Typography>}
        />
      </div>
    </Dialog>
  );
}
