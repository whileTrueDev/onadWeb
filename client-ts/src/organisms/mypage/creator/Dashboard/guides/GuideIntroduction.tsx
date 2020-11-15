import { Typography } from '@material-ui/core';
import React from 'react';

export default function GuideIntroduction(): JSX.Element {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ margin: 16 }}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>온애드 시작하기</Typography>
      </div>

      <div style={{ margin: 16 }}>
        <Typography>온애드는 1인미디어 방송의 배너 광고를 도와주는 툴입니다.</Typography>
        <Typography>광고 수익은 데이터에 의해 올바르게 측정됩니다.</Typography>

        <Typography>온애드를 이용하기 위해서는 필수 2가지 과정이 필요합니다.</Typography>

        <Typography>시작하기 가이드를 통해 몇가지 절차를 완료한 이후</Typography>
        <Typography>방송화면에 배너 광고를 유치해보세요.</Typography>
      </div>
    </div>
  );
}
