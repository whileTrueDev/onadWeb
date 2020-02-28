import {
  useState, useEffect, useCallback
} from 'react';
import axios from 'axios';
import host from '../../config';
import querify from '../querify';
import history from '../../history';

const UNAUTHORIZED = 401;

/**
 * API서버로 `GET` 요청을 보낼 때 사용하는 react **hook**.
 * ## 타입파라미터 (제네릭)
 * @type `PARAM_TYPE` API서버로 보낼 파라미터의 타입
 * @type `RES_DATA_TYPE` API서버로부터 전달받을 데이터 타입
 * 
 * ## 파라미터
 * @param {string} url 데이터를 삭제할 API 서버 endpoint
 * @param {PARAM_TYPE} params GET 요청에 필요한 파라미터 객체
 * 
 * ## 반환값
 * @return 전달받은데이터 `data`
 * @return 로딩여부 `loading`
 * @return 에러메시지문자열 `error`
 * @return GET요청함수 `doGetRequest`
 * @example
 * const {
 *   data, loading, error, doGetRequest
 * } = useGetData<ParameterType, ResponseDataType>('/test',
 *   () => { console.log('success callback done'); handleOpen(); }  
 * );
 */
export default function useGet<PARAM_TYPE={[key: string]: any}, RES_DATA_TYPE = any>(
  url: string, params?: PARAM_TYPE
): {
  data: RES_DATA_TYPE | null;
  loading: boolean | null;
  error: string;
  doGetRequest: () => void;
  setData: React.Dispatch<React.SetStateAction<RES_DATA_TYPE | null>>;
} {
  const [param] = useState(params);
  const [data, setData] = useState<RES_DATA_TYPE | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  const [unmounted, setUnmounted] = useState(false);
  const [source] = useState(axios.CancelToken.source());

  const doGetRequest = useCallback(() => {
    axios.get<RES_DATA_TYPE>(`${host}${url}${querify(param)}`, {
      cancelToken: source.token,
      withCredentials: true
    })
      .then((res) => { // 상태코드 200번대 
        if (!unmounted) { // 컴포넌트가 unmount 되지 않은 경우
          setLoading(false); // 로딩 완료
          setData(res.data); // 데이터 설정
        }
      })
      .catch((err) => { // 상태코드 300~
        if (!unmounted) { // 컴포넌트가 unmount 되지 않은 경우
          setLoading(false); // 로딩 완료
          if (err && err.isAxiosError) {
            // 요청 캔슬된 경우
            if (axios.isCancel(err)) {
              console.log(`request cancelled:${err.message}`);
            }
            if (err.response && err.response.status) {
              // 세션없는 요청의 경우
              if (err.response.status === UNAUTHORIZED) {
                history.push('/');
              } else {
                console.log('statuscode: ', err.response.status, err.response.data);
                setError(err.response.data.message || '죄송합니다.. 오류입니다..');
              }
            }
          } else {
            // axios 에러가 아닌 경우
            console.log('not axios error - ', err);
          }
        }
      });
  }, [source.token, unmounted, param, url]);

  useEffect(() => {
    doGetRequest();

    // cleanup function
    return (): void => {
      setUnmounted(true);
      source.cancel('Cancelling in cleanup');
    };
  }, [doGetRequest, source]);

  return {
    data, loading, error, doGetRequest, setData
  };
}
