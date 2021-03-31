import React from 'react';
import EventPopup from '../../../atoms/Dialog/EventPopup';

export interface RenewalDialogProps {
  open: boolean;
  onClose: () => void;
}
export default function RenewalDialog({
  open,
  onClose,
}: RenewalDialogProps): JSX.Element {
  const GOOGLE_FORM_URL = 'https://forms.gle/196HNR6iDV8U3Zk79';
  return (
    <EventPopup
      onClose={onClose}
      open={open}
      backgroundImg=""
      disableCloseButton
      disableFullWidth
      noShowKey="cps-event-popup-no-show"
    >
      <img draggable={false} src="/pngs/main-popup/cps_full.png" alt="" height={600} width="100%" />
      <button
        type="button"
        style={{
          position: 'absolute',
          backgroundColor: 'tan',
          bottom: 60,
          left: 130,
          height: 65,
          width: 185,
          opacity: 0,
          cursor: 'pointer',
        }}
        onClick={(): void => {
          window.open(GOOGLE_FORM_URL);
        }}
      >
        참여하기
      </button>
    </EventPopup>
  );
}
