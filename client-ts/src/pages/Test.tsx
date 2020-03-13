import React from 'react';
import {
  useGetRequest, usePostRequest, useDeleteRequest, usePatchRequest, usePutRequest
} from '../utils/hooks';
import HOST from '../config';
import useDialog from '../utils/hooks/useDialog';
import Snackbar from '../atoms/Snackbar/Snackbar';

interface CreatorParam {
  creatorId: number;
}

interface CreatorGetRes {
  creatorId: number | string;
  message: string;
}

interface CreatorPostRes {
  creatorId: string;
}

export default function App(): React.ReactElement {
  const post = useDialog();
  const put = useDialog();
  const patch = useDialog();
  const deletee = useDialog();

  const usePost = usePostRequest<CreatorParam, CreatorPostRes>('/test', () => { post.handleOpen(); });
  const useDelete = useDeleteRequest<CreatorParam, CreatorPostRes>('/test', () => { deletee.handleOpen(); });
  const usePatch = usePatchRequest<CreatorParam, CreatorPostRes>('/test', () => { patch.handleOpen(); });
  const usePut = usePutRequest<CreatorParam, CreatorPostRes>('/test', () => { put.handleOpen(); });

  const {
    data, loading, error, doGetRequest
  } = useGetRequest<CreatorParam, CreatorGetRes>('/test', { creatorId: 130096343 });

  return (
    <div>
      <h3>
        {loading ? 'Loading...' : null}
      </h3>
      <h3>
        {error && `에러는:${error}` }
      </h3>
      <h3>
        데이터:
        {data && JSON.stringify(data)}
      </h3>
      <div style={{
        width: '50%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}
      >
        <button type="button" onClick={(): void => { document.location.href = `${HOST}/api/login/twitch`; }}>
          트위치 로그인
        </button>
        <button type="button" onClick={(): void => { doGetRequest(); }}>/test에 get 요청 보내기</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button type="button" onClick={(): void => { usePost.doPostRequest({ creatorId: 130096343 }); }}>/test에 post 요청 보내기</button>
          {post.open && (
          <div>
            post 성공시 생기는 글자
            {usePost.loading && (<span>loading</span>)}
            {!usePost.loading && usePost.data && (<span>{JSON.stringify(usePost.data)}</span>)}
          </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button type="button" onClick={(): void => { usePut.doPutRequest({ creatorId: 130096343 }); }}>/test에 put 요청 보내기</button>
          {put.open && (
          <div>
            put 성공시 생기는 글자
            {usePut.loading && (<span>loading</span>)}
            {!usePut.loading && usePut.data && (<span>{JSON.stringify(usePut.data)}</span>)}
          </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button type="button" onClick={(): void => { usePatch.doPatchRequest({ creatorId: 130096343 }); }}>/test에 patch 요청 보내기</button>
          {patch.open && (
          <div>
            patch 성공시 생기는 글자
            {usePatch.loading && (<span>loading</span>)}
            {!usePatch.loading && usePatch.data && (<span>{JSON.stringify(usePatch.data)}</span>)}
          </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button type="button" onClick={(): void => { useDelete.doDeleteRequest({ creatorId: 130096343 }); }}>/test에 delete 요청 보내기</button>
          {deletee.open && (
          <div>
            delete 성공시 생기는 글자
            {useDelete.loading && (<span>loading</span>)}
            {!useDelete.loading
             && useDelete.data && (<span>{JSON.stringify(useDelete.data)}</span>)}
          </div>
          )}
        </div>
      </div>

    </div>
  );
}
