import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Typography, CircularProgress } from '@material-ui/core';
import Button from '../../atoms/CustomButtons/Button';
import axios from '../../utils/axios';
import HOST from '../../config';

interface AdChatParams {
  campaignId: string;
  referrer: string;
  userAgent: string;
}
interface AdChatRes {
  message: string;
  href: string;
}
export default function AdChat(
  { match }: RouteComponentProps<{campaignId: string}>
): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  React.useEffect(() => {
    const params: AdChatParams = {
      campaignId: match.params.campaignId,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };
    axios.post<AdChatRes>(`${HOST}/tracking/adchat`, params)
      .then((row) => {
        if (row.data && row.data.message === 'success') {
          // document.location.href = row.data.href;
        }
      })
      .catch((err) => {
        if (err.response) { // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답한 경우.
          console.error('error in POST /tracking/adchat: ', err.response.status, err.response.data);
          setError(err.response.status);
        } else if (err.request) { // 요청이 이루어 졌으나 응답을 받지 못한 경우.
          console.log('요청이 이루어 졌으나 응답을 받지 못한 경우: ', err.request);
          setError(err.request);
        } else { // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생
          console.log('오류를 발생시킨 요청을 설정하는 중에 문제가 발생');
          setError(err);
        }
      });
  }, [match.params.campaignId]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}
    >
      {!error && (
        <>
          <CircularProgress size={100} disableShrink style={{ padding: 48 }} />
          <Typography variant="h5"> 이동중입니다... </Typography>
        </>
      )}
      {!error && (
        <>
          <Typography variant="h5"> 죄송합니다. 지금은 접근할 수 없습니다 다시 시도해 주십시오. </Typography>
          <Button
            onClick={(): void => { window.history.back(); }}
          >
            돌아가기
          </Button>
        </>
      )}
    </div>
  );
}
