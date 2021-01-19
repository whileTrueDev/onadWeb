import {
  makeStyles, Typography
} from '@material-ui/core';
import { Done } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: 'bold' },
  doneSection: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  successSection: {
    width: 180,
    height: 130,
    background: 'no-repeat center url(/pngs/dashboard/ad_manage/paper_pollen.gif)',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    fontSize: 80,
    color: theme.palette.common.white,
    padding: 16,
    backgroundColor: theme.palette.success.light,
    borderRadius: '50%',
  },
}));

export default function GuideComplete(): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.doneSection}>
        <div className={classes.successSection}>
          <Done className={classes.icon} />
        </div>

        <br />
        <Typography className={classes.bold}>광고 설정이 완료되었습니다.</Typography>
        <br />
        <Typography>이제 트위치/아프리카 방송을 진행하여 수익을 창출하세요!</Typography>

        <br />
        <Typography>[다음] 버튼을 눌러, 수익금 출금 방법을 확인해보세요!</Typography>
      </div>
    </div>
  );
}
