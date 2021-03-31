import { Typography } from '@material-ui/core';
import React from 'react';
import EventPopup from '../../../atoms/Dialog/EventPopup';

export interface ReferralCodeEventDialogProps {
  open: boolean;
  onClose: () => void;
}
export default function ReferralCodeEventDialog({
  open,
  onClose,
}: ReferralCodeEventDialogProps): JSX.Element {
  return (
    <EventPopup
      noShowKey="renewal-popup-no-show"
      onClose={onClose}
      open={open}
      backgroundImg="/pngs/main-popup/popup_background.png"
    >
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
          backgroundColor: 'white', boxShadow: '10px 5px 5px black', borderRadius: 12, textAlign: 'center', color: 'black'
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

          <Typography variant="body2" style={{ fontWeight: 'bold' }}>온애드에 가입할 때 추천인 코드를 입력하면</Typography>
          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              신규 가입자에게 온애드 수익금
            {' '}
            <Typography component="span" variant="body2" color="primary" style={{ fontWeight: 'bold' }}>
                5,000원이 적립
            </Typography>
              되며,
          </Typography>
          <Typography variant="body2" style={{ fontWeight: 'bold' }}>동료 BJ에게 추천인 코드를 전달하고</Typography>
          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              추천받은 BJ가 신규가입 하면
            {' '}
            <Typography component="span" variant="body2" color="primary" style={{ fontWeight: 'bold' }}>
                5,000원이 적립
            </Typography>
              됩니다.
          </Typography>

          <br />

          <div style={{
            backgroundColor: 'rgba(231, 245, 255)', textAlign: 'start', padding: 32, borderRadius: '0px 0px 12px 12px'
          }}
          >
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                - 추천인 코드는
              {' '}
              <Typography component="span" variant="body2" color="error" style={{ fontWeight: 'bold' }}>
                1회만
              </Typography>
              {' '}
                사용 가능합니다.
            </Typography>
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                - 신규가입자가 아닌, 기존 회원은
              {' '}
              <Typography component="span" variant="body2" color="error" style={{ fontWeight: 'bold' }}>
                  추천만
              </Typography>
              {' '}
                가능합니다.
            </Typography>
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
    </EventPopup>
  );
}
