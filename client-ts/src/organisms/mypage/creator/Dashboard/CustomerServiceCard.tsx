import React from 'react';
import {
  makeStyles, Paper, Typography
} from '@material-ui/core';
import Button from '../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles((theme) => ({

}));


export default function CustomerServiceCard(): JSX.Element {
  const classes = useStyles();
  return (
    <Paper
      style={{
        padding: 32, marginTop: 8, height: 250, overflowY: 'auto'
      }}
    >
      <Typography style={{ fontWeight: 'bold' }}>
        온애드는 항상 열려있습니다.
      </Typography>

      <Typography variant="caption" color="textSecondary">
        궁금한 점, 버그제보, 기능제안 등 어떠한 내용이든 괜찮습니다. 언제나 크리에이터 분들과 함께 성장하기 위해 노력합니다.
      </Typography>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button
          color="primary"
          onClick={(): void => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
        >
          문의하기
        </Button>
      </div>
    </Paper>
  );
}
