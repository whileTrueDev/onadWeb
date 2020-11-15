import React from 'react';
import {
  makeStyles, Paper, Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

}));


export default function EventInfoCard(): JSX.Element {
  const classes = useStyles();
  return (
    <Paper
      style={{
        padding: 32, marginTop: 8, height: 250, overflowY: 'auto'
      }}
    >
      <Typography style={{ fontWeight: 'bold' }}>
        새로운 제품을 체험해보세요.
      </Typography>

      <Typography variant="caption" color="textSecondary">
        데이터 분석을 통해 긴 방송 중의 하이라이트 포인트를 찾아주고, 진행한 방송과 방송인에 대한 민심을 알려드립니다. 클로즈 베타를 신청해 미리 경험해보세요!
      </Typography>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Typography
          color="primary"
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={(): void => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
        >
          Truepoint 알아보기
        </Typography>
      </div>
    </Paper>
  );
}
