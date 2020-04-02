import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, FormControlLabel, Switch,
  Divider,
} from '@material-ui/core';
import Card from '../../../../atoms/Card/Card';
import useToggle from '../../../../utils/hooks/useToggle';

const useStyles = makeStyles((theme) => ({
  head: { display: 'flex', justifyContent: 'space-between', padding: theme.spacing(2) },
  body: { padding: theme.spacing(2) },
  emphasizedText: {
    color: theme.palette.secondary.main, fontWeight: theme.typography.fontWeightBold
  }
}));

export default function AdChatOnOffCard(): JSX.Element {
  const toggle = useToggle();
  const classes = useStyles();
  return (
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
              checked={toggle.toggle}
              onChange={toggle.handleToggle}
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
  );
}
