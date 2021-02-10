import { Typography } from '@material-ui/core';
import React from 'react';

export default function CpaStop(): JSX.Element {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80vh'
    }}
    >
      <div style={{ padding: 40 }}>
        {[0, 0, 0, 0, 0, 0, 0, 0].map((ele) => (
          <img
            key={ele}
            src="https://static-cdn.jtvnw.net/emoticons/v2/86/default/light/3.0"
            alt=""
            width={50}
            height={50}
          />
        ))}
      </div>
      <Typography variant="body1">
        참여형 광고 시스템에 문제가 발생해 점검중에 있습니다.
      </Typography>
      <Typography variant="body1">
        자세한 사항은
        {' '}
        <a style={{ textDecoration: 'underline' }} href="/mypage/creator/notice">공지사항</a>
        을 확인해주시기 바랍니다.
      </Typography>
    </div>
  );
}
