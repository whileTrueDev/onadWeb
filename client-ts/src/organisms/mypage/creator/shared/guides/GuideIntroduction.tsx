import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  container: { textAlign: 'center' },
  section: { margin: theme.spacing(2) },
  title: { fontWeight: 'bold' },
}));

export default function GuideIntroduction(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.section}>
        <Typography variant="h6" className={classes.title}>온애드 시작하기</Typography>
      </div>

      <div className={classes.section}>
        <Typography>온애드는 1인 미디어 방송인분들을 위한 배너 광고 플랫폼입니다.</Typography>
        <Typography>쉽고 빠르게 광고를 유치하고, 수익을 창출할 수 있게 도와줍니다.</Typography>

        {/* 온애드 유튜브 영상 (마케터용 영상이라 혼란만 가중할 듯.) */}
        {/* <div className={classes.section}>
          <iframe title="yt-onad-desc" width="560" height="315" src="https://www.youtube.com/embed/hwUgWypZyh8?controls=0&autoplay=1" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div> */}

        <br />
        <Typography>몇 가지 간단한 설정을 통해 10분 안에 광고를 유치하고,</Typography>
        <Typography>데이터에 비례한 합리적인 수익을 창출할 수 있습니다.</Typography>

        <br />
        <Typography>[다음] 버튼을 눌러,</Typography>
        <Typography>온애드를 사용하기 위한 설정을 시작해보세요!</Typography>
      </div>
    </div>
  );
}
