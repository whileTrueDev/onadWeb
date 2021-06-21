import React from 'react';
import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  sampleImg: {
    width: 400,
    height: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: '20px 0',
  },
  wraper: {
    width: '80%',
    margin: 'auto',
  },
  sampleRealAccount: {
    width: '100%',
    height: 800,
  },
  sampleInternetAccount: {
    width: '100%',
    height: 800,
  },
}));

function ImageUploadAccount(): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
        className={classes.wraper}
      >
        <Grid item className={classes.title}>
          온애드는 수익금을 소유하신 계좌로 지급해드립니다. 아래 두 가지 방법 중 편한 방법으로
          이미지를 업로드 해주시기 바랍니다.
        </Grid>
        <Grid item className={classes.title}>
          1. 실물 통장 사본
        </Grid>
        <Grid item>
          <img
            src="/pngs/settlement/real-account.png"
            alt="실물통장사본"
            className={classes.sampleRealAccount}
          />
        </Grid>
        <Grid item>
          위와같이 계좌번호, 은행, 발급지점, 발급일등이 표시된 첫 번째 장을 카메라로 촬영하거나
          스캔한 뒤 이미지 파일로 업로드 해 주시면 됩니다.
        </Grid>
        <Grid item className={classes.title}>
          2. 인터넷 출력
        </Grid>
        <Grid item>
          <img
            src="/pngs/settlement/internet-account.png"
            alt="인터넷출력"
            className={classes.sampleInternetAccount}
          />
        </Grid>
        <Grid item>
          통장실물을 가지고 있지 않거나 온라인 전용계좌일 경우, 각 은행 인터넷 뱅킹 및 일부 모바일
          뱅킹 앱에서 제공하는 &apos;통장사본 출력&apos; 기능을 이용, 이미지 파일로
          업로드해주십시오.
          <p>
            - 통장사본 출력의 경우 은행별로 조금씩 명칭이 상이하며, 계좌개설확인서 발급, 통장앞면
            인쇄, 통장표지출력, 통장 표제부출력 등의 메뉴를 확인하시면 됩니다.
          </p>
          <p style={{ color: 'red' }}>
            - 인터넷뱅킹, 모바일 뱅킹 앱 등의 &apos;계좌목록&apos; 화면 캡쳐 이미지를 업로드 하시는
            경우 반려처리 되므로 업로드 전 확인 부탁드립니다.
          </p>
          <p style={{ color: 'red' }}>- 이미지 크기는 5MB이하로 올려주시기 바랍니다.</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default ImageUploadAccount;
