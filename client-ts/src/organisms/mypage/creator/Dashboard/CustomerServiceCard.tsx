import React from 'react';
import {
  makeStyles, Paper, Typography
} from '@material-ui/core';
import Button from '../../../../atoms/CustomButtons/Button';
import openKakaoChat from '../../../../utils/openKakaoChat';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4), marginTop: theme.spacing(1), height: 250, overflowY: 'auto'
  },
  bold: { fontWeight: 'bold' },
  buttonSection: { marginTop: theme.spacing(2), textAlign: 'center' },
}));

export default function CustomerServiceCard(): JSX.Element {
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <Typography className={classes.bold}>
        온애드는 항상 열려있습니다.
      </Typography>

      <Typography variant="caption" color="textSecondary">
        궁금한 점, 버그제보, 기능제안 등 어떠한 내용이든 괜찮습니다. 언제나 방송인 분들과 함께 성장하기 위해 노력합니다.
      </Typography>

      <div className={classes.buttonSection}>
        <Button
          color="primary"
          onClick={openKakaoChat}
        >
          문의하기
        </Button>
      </div>
    </Paper>
  );
}
