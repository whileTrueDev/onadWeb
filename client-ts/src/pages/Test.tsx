import React from 'react';
import { useGetRequest } from '../utils/hooks';
import HOST from '../config';

interface CreatorGetParam {
  creatorId: number;
}

interface CreatorGetRes {
  creatorId: number | string;
  message: string;
}

export default function App(): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const {
    data, loading, error, doGetRequest
  } = useGetRequest<CreatorGetParam, CreatorGetRes>('/test', { creatorId: 130096343 });

  return (
    <div>
      hi
      <h1>
        {loading ? 'Loading...' : null}
      </h1>
      <h2>
        에러는:
        {' '}
        {error && error }
      </h2>
      <h2>
        데이터는:
        {data && JSON.stringify(data)}
      </h2>
      <button type="button" onClick={(): void => { document.location.href = `${HOST}/api/login/twitch`; }}>
        <img src="/pngs/logo/twitch.png" alt="google" />
      </button>
      <button type="button" onClick={(): void => { doGetRequest(); }}>/test에 get 요청 보내기</button>
      {open ? (
        <h1>
          성공시 생기는 글자
        </h1>
      ) : (
        null
      )}
    </div>
  );
}
