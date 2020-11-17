import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  container: { textAlign: 'center' },
}));
export default function SetSettlementSection(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.container}>
        <Typography>광고를 진행해서 수익을 창출했다면,</Typography>
        <Typography>당연히 해당 수익을 현금화 할수 있어야겠죠?</Typography>

        <br />
        <Typography>온애드에서는 안전하게 수익금을 정산하기 위해</Typography>
        <Typography>크리에이터님에 대한 몇가지 정보가 필요합니다.</Typography>

        <br />
        <Typography>여기는 추후에 추가할예정입니다.</Typography>
      </div>
    </div>
  );
}
