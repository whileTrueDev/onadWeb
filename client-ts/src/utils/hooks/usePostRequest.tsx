import { useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import axios from '../axios';
import host from '../../config';

const DEFAULT_ERROR_MESSAGE = '죄송합니다.. 오류가 발생했습니다..';
export interface UsePostRequestObject<T, P> {
  success: true | null;
  loading: boolean;
  error: string;
  doPostRequest: (param?: T) => Promise<AxiosResponse<P>>;
  data: P | null;
}
/**
 * API서버로 `POST` 요청을 보낼 때 사용하는 react **hook**.
 * ## 타입파라미터 (제네릭)
 * @type `PARAM_TYPE` API서버로 보낼 파라미터의 타입
 * @type `RES_DATA_TYPE` API서버로부터 전달받을 데이터 타입
 *
 * ## 파라미터
 * @param {*} url 데이터를 삽입할 API 서버 endpoint
 * @param {*} successCallback 데이터 삽입 성공시 callback함수. (스낵바오픈 or 새로고침 or 등등)
 *
 * ## 반환값
 * @return 성공여부 `success`
 * @return 로딩여부 `loading`
 * @return 에러메시지문자열 `error`
 * @return 전달받은데이터 `data`
 * @return POST요청함수 `doPostRequest`
 * @example
 * const {
 *   success, loading, error, doPostRequest
 * } = usePostData<ParameterType, ResponseDataType>('/test',
 *   () => { console.log('success callback done'); handleOpen(); }
 * );
 */
export default function usePostRequest<PARAM_TYPE = { [key: string]: any }, RES_DATA_TYPE = any>(
  url: string,
  successCallback?: () => void,
): UsePostRequestObject<PARAM_TYPE, RES_DATA_TYPE> {
  const [success, setSuccess] = useState<true | null>(null);
  const [data, setData] = useState<RES_DATA_TYPE | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  const doPostRequest = useCallback(
    async (param?: PARAM_TYPE): Promise<AxiosResponse<RES_DATA_TYPE>> => {
      setLoading(true); // 로딩 시작
      return axios
        .post<RES_DATA_TYPE>(`${host}${url}`, { ...param })
        .then(res => {
          // 200 번대 상태코드
          setLoading(false); // 로딩 완료
          setData(res.data);
          setSuccess(true);
          if (successCallback) {
            successCallback();
          }
          return res;
        })
        .catch(err => {
          setLoading(false); // 로딩 완료
          setSuccess(null);

          if (err.response) {
            // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답한 경우.
            console.error(`error in POST ${url}: `, err.response.status, err.response.data);
            setError(err.response.data.message || DEFAULT_ERROR_MESSAGE);
          } else if (err.request) {
            // 요청이 이루어 졌으나 응답을 받지 못한 경우.
            console.log('요청이 이루어 졌으나 응답을 받지 못한 경우: ', err.request);
            setError(DEFAULT_ERROR_MESSAGE);
          } else {
            // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생
            console.log('오류를 발생시킨 요청을 설정하는 중에 문제가 발생');
            setError(DEFAULT_ERROR_MESSAGE);
          }
          throw err;
        });
    },
    [successCallback, url],
  );

  return {
    success,
    loading,
    error,
    data,
    doPostRequest,
  };
}
