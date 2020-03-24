import {
  useState, useEffect, useCallback, useRef
} from 'react';
import axios from '../../axios';
import host from '../../config';
import querify from '../querify';
import history from '../../../history';

const SESSION_NOT_EXISTS = 'session not exists';

/**
 * @author hwasurr
 * @description api 서버와의 통신을 통해 데이터를 가져오는 훅. ( only get 방식)
 * @param {string} url 데이터를 받아 올 api 엔드포인트
 * @param {object} params fetch를 위한 데이터
 * @returns { object, bool, string, func}
 * payload: api 서버로부터의 데이터,
 * loading: 데이터가 도착하기 이전까지 ture, 도착이후 false 값,
 * error: 에러의 종류 문자열,
 * callUrl: 재요청이 필요한 작업에서 사용하기위한, 데이터 요청함수
 */
export default function useFetchData(url, params) {
  const [param] = useState(params);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const didCancle = useRef(false);
  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3002${url}${querify(param)}`);

      if (res.data) {
        if (res.data === SESSION_NOT_EXISTS) {
          history.push('/');
        } else if (!didCancle.current) {
          setPayload(res.data);
        }
      } else {
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      if (!didCancle.current) {
        setError(`데이터가 없습니다.${url}`);
      }
    } finally {
      setLoading(false);
    }
  }, [param, url]);

  useEffect(() => {
    callUrl();

    // cleanup function
    return () => {
      didCancle.current = true;
    };
  }, [callUrl]);

  return {
    payload, loading, error, callUrl, setPayload
  };
}
