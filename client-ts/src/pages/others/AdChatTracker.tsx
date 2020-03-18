import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Typography, CircularProgress } from '@material-ui/core';
import useGetRequest from '../../utils/hooks/useGetRequest';

interface AdChatRes {
  message: string;
  href: string;
}
export default function AdChat(
  { match }: RouteComponentProps<{campaignId: string}>
): JSX.Element {
  console.log(navigator.userAgent); // 유저에이전트
  console.log(document.referrer); // 리퍼러
  const AdChatGet = useGetRequest<undefined, AdChatRes>(`/tracking/adchat/${match.params.campaignId}`);

  React.useEffect(() => {
    if (AdChatGet.data && AdChatGet.data.message === 'success') {
      document.location.href = AdChatGet.data.href;
    }
  }, [AdChatGet.data]);
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'
    }}
    >
      <CircularProgress size={100} disableShrink style={{ padding: 48 }} />
      <Typography variant="h5"> 이동중입니다... </Typography>
    </div>
  );
}
