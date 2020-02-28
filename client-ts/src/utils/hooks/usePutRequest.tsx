import React, { useCallback } from 'react';
import axios from '../axios';
import host from '../../config';

const DEFAULT_ERROR_MESSAGE = '죄송합니다.. 오류입니다..';

/**
 * API서버로 `PUT` 요청을 보낼 때 사용하는 react **hook**.
 * ## 타입파라미터 (제네릭)
 * @type `PARAM_TYPE` API서버로 보낼 파라미터의 타입
 * @type `RES_DATA_TYPE` API서버로부터 전달받을 데이터 타입
 * 
 * ## 파라미터
 * @param {*} url 데이터를 전체수정할 API 서버 endpoint
 * @param {*} successCallback 데이터 전체수정 성공시 callback함수. (스낵바오픈 or 새로고침 or 등등)
 * 
 * ## 반환값
 * @return 성공여부 `success`
 * @return 로딩여부 `loading`
 * @return 에러메시지문자열 `error`
 * @return 전달받은데이터 `data`
 * @return PUT요청함수 `doPutRequest`
 * @example
 * const {
 *   success, loading, error, doPutRequest
 * } = usePutData<ParameterType, ResponseDataType>('/test',
 *   () => { console.log('success callback done'); handleOpen(); }  
 * );
 */
export default function usePutRequest<PARAM_TYPE = {[key: string]: any}, RES_DATA_TYPE = any>(
  url: string,
  successCallback?: () => void
): {
  success: true | null;
  loading: boolean | null;
  error: string;
  data: RES_DATA_TYPE | null;
  doPutRequest: (param: PARAM_TYPE) => void;
} {
  const [success, setSuccess] = React.useState<true | null>(null);
  const [data, setData] = React.useState<RES_DATA_TYPE | null>(null);
  const [loading, setLoading] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState('');

  const doPutRequest = useCallback((param: PARAM_TYPE): void => {
    setLoading(true); // 로딩 시작
    axios.put<RES_DATA_TYPE>(`${host}${url}`,
      { data: { ...param } })
      .then((res) => {
        setLoading(false); // 로딩 완료

        const { status } = res;
        setData(res.data);
        if (Math.floor(status / 100) === 2) {
          setSuccess(true);
          if (successCallback) { successCallback(); }
        }
      })
      .catch((err) => {
        setLoading(false); // 로딩 완료
        setSuccess(null);

        console.error(`error in PUT ${url}: `, err.response.status, err.response.data);
        if (err.response) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답한 경우.
          console.log('2xx의 범위를 벗어나는 상태 코드로 응답한 경우');
          setError(err.response.data.message || DEFAULT_ERROR_MESSAGE);
        } else if (err.request) {
          // 요청이 이루어 졌으나 응답을 받지 못한 경우.
          console.log('요청이 이루어 졌으나 응답을 받지 못한 경우: ', err.request);
          setError(DEFAULT_ERROR_MESSAGE);
        } else {
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생
          console.log('오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다');
          setError(DEFAULT_ERROR_MESSAGE);
        }
      });
  }, [successCallback, url]);


  return {
    success, loading, error, data, doPutRequest,
  };
}
