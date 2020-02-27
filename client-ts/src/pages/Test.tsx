import React from 'react';
import useDeleteData from '../utils/hooks/useDeleteData';

interface BannerDeleteParam {
  someParam: string;
}

interface BannerDeleteRes {
  bannerId: string;
}

export default function App() {
  const [open, setOpen] = React.useState(false);
  const {
    success, loading, error, doDeleteRequest
  } = useDeleteData<BannerDeleteParam, BannerDeleteRes>(
    '/test',
    () => { console.log('success callback done'); setOpen(true); }
  );

  return (
    <div>
      hi
      <h1>
        {loading ? 'Loading...' : null}
      </h1>
      <h1>
        {success ? 'success' : 'fail'}
      </h1>
      <h2>
        에러는:
        {' '}
        {error && error }
      </h2>
      <button type="button" onClick={() => { doDeleteRequest({ someParam: 'delete param' }); }}>/test에 delete 요청 보내기</button>
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
