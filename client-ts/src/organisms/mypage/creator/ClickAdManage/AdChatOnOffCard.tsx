import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, FormControlLabel, Switch,
  Divider,
} from '@material-ui/core';
import Card from '../../../../atoms/Card/Card';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import useToggle from '../../../../utils/hooks/useToggle';
import useDialog from '../../../../utils/hooks/useDialog';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';

const useStyles = makeStyles((theme) => ({
  head: { display: 'flex', justifyContent: 'space-between', padding: theme.spacing(2) },
  body: { padding: theme.spacing(2) },
  emphasizedText: {
    color: theme.palette.secondary.main, fontWeight: theme.typography.fontWeightBold
  }
}));

interface AdChatOnOffCardProps {
  adChatOnOff: 1|0;
  doGetReqeustOnOff: () => void;
}
export default function AdChatOnOffCard({
  adChatOnOff, doGetReqeustOnOff
}: AdChatOnOffCardProps): JSX.Element {
  const classes = useStyles();

  // OnOff toggle
  const onoff = useToggle(adChatOnOff === 1);
  const onOffUpdate = usePatchRequest('/creator/adchat/agreement', () => {
    doGetReqeustOnOff();
  });
  const handleSwitch = (): void => {
    onOffUpdate.doPatchRequest({ targetOnOffState: !onoff.toggle });
  };

  // For Onoff success snackbar
  const snack = useDialog();
  const failSnack = useDialog();

  // For OnOff update error
  React.useEffect(() => {
    if (onOffUpdate.error) {
      failSnack.handleOpen();
    }
  }, [failSnack, onOffUpdate.error]);

  return (
    <>
      <Card>
        <div className={classes.head}>
          <Typography variant="h6">
            채팅 광고 On/Off
          </Typography>
          <FormControlLabel
            label=""
            control={(
              <Switch
                color="secondary"
                checked={onoff.toggle}
                onChange={(): void => {
                  onoff.handleToggle();
                  handleSwitch();
                  snack.handleOpen();
                }}
              />
            )}
          />
        </div>

        <Divider />

        <div className={classes.body}>
          <div style={{ textAlign: 'center' }}>
            <img src="/pngs/dashboard/onaddy_example.png" alt="onaddy_example" style={{ maxWidth: '100%' }} />
          </div>
          <Typography variant="body2">
            온애드의 광고채팅봇 onadyy는 주기적으로 광고에 대한 설명과 광고 링크를 채팅으로 홍보합니다.
            시청자가 onadyy가 홍보한 링크를 클릭하면, 클릭에 대한 수익이 크리에이터에게 발생합니다.
          </Typography>
          <br />
          <Typography variant="body2">
            onadyy가 채널 채팅창에서 홍보하는 것을 허용하려면
            {' '}
            <span className={classes.emphasizedText}>스위치를 On</span>
            {' '}
            시켜주세요.
          </Typography>
          <Typography variant="body2">
            또한, onadyy가 광고채팅을 원활히 진행할 수 있게 채팅창에서 &quot;
            <span className={classes.emphasizedText}>/mod onaddy</span>
            &quot;를 입력해 매니저로 임명해주세요!
          </Typography>
        </div>
      </Card>

      <Snackbar
        color="success"
        open={snack.open}
        message="정상적으로 변경되었습니다."
        onClose={snack.handleClose}
      />

      <Snackbar
        color="error"
        open={failSnack.open}
        message="변경중 오류가 발생했습니다."
        onClose={failSnack.handleClose}
      />

    </>
  );
}
