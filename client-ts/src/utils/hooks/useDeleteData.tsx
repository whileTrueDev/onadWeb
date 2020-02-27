import React, { useCallback } from 'react';
import axios from '../axios';
import host from '../../config';

/**
 * API서버로 `DELETE` 요청을 보낼 때 사용하는 react **hook**.
 * ## 타입파라미터 (제네릭)
 * @type `PARAM_TYPE` API서버로 보낼 파라미터의 타입
 * @type `RES_DATA_TYPE` API서버로부터 전달받을 데이터 타입
 * 
 * ## 파라미터
 * @param {*} url 데이터를 삭제할 API 서버 endpoint
 * @param {*} successCallback 데이터 삭제 성공시 callback함수. (스낵바오픈 or 새로고침 or 등등)
 * 
 * ## 반환값
 * @return 성공여부 `success`
 * @return 로딩여부 `loading`
 * @return 에러메시지문자열 `error`
 * @return 전달받은데이터 `data`
 * @return DELETE요청함수 `doDeleteRequest`
 * @example
 * const {
 *   success, loading, error, doDeleteRequest
 * } = useDeleteData<ParameterType, ResponseDataType>('/test',
 *   () => { console.log('success callback done'); handleOpen(); }  
 * );
 */
export default function useDeleteData<PARAM_TYPE = {[key: string]: any}, RES_DATA_TYPE = any>(
  url: string,
  successCallback?: () => void
): {
  success: true | null;
  loading: boolean | null;
  error: string;
  data: RES_DATA_TYPE | null;
  doDeleteRequest: (param: PARAM_TYPE) => void;
} {
  const [success, setSuccess] = React.useState<true | null>(null);
  const [loading, setLoading] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState<RES_DATA_TYPE | null>(null);

  const doDeleteRequest = useCallback((param: PARAM_TYPE): void => {
    setLoading(true); // 로딩 시작
    axios.delete<RES_DATA_TYPE>(`${host}${url}`,
      { data: { ...param } })
      .then((res) => {
        setLoading(false); // 로딩 완료

        const { status, statusText } = res;
        setData(res.data);
        if (Math.floor(status / 100) === 2) {
          setSuccess(true);
          if (successCallback) { successCallback(); }
        } else {
          setSuccess(null);
          setError(statusText);
        }
      })
      .catch((err) => {
        setLoading(false); // 로딩 완료
        setSuccess(null);
        if (err && err.isAxiosError) {
          console.log('statuscode: ', err.response.status, err.response.data);
          setError(err.response.data.message || '죄송합니다.. 오류입니다..');
        } else {
          // axios 에러가 아닌 경우
          console.log(err);
        }
      });
  }, [successCallback, url]);


  return {
    success, loading, error, data, doDeleteRequest,
  };
}
