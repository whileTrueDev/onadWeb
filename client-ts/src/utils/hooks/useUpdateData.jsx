import React from 'react';
import axios from '../axios';
import host from '../../config';

/**
 * update 요청을 위한 hook
 * @param {String} url 데이터를 수정 또는 삽입요청할 라우터
 * @param {Function} callUrl 데이터 조회 요청
 * @author hwasurr
 */
export default function useUpdateData(url, successCallback = null) {
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  /**
   * api 서버에 데이터를 업데이트 요청하는 함수로, 인자로 업데이트를 진행할 데이터(객체형태)를 받는다.
   * 요청시, 해당 라우터에 데이터를 보내고, api서버로부터 응답이 도착한 이후 훅의 두번쨰 인자로 넘겨준
   * 데이터 요청 함수를 실행한다. 만일 데이터 요청 함수를 인자로 넘겨주지 않은 경우 재요청을 실행하지 않는다.
   * @param {object} data { 데이터 명: 데이터 } 와 같은
   * @author hwasurr
   */
  function handleUpdateRequest(data) {
    axios
      .post(`${host}${url}`, data)
      .then(res => {
        setLoading(false);
        setSuccess(res.data);
        if (res.data[0]) {
          if (successCallback) {
            successCallback();
          }
        } else if (res.data[1]) {
          // 요청에 대한 update가 진행되던 중 오류가 발생.
          alert(res.data[1]);
        } else {
          alert('오류가 발생했습니다.');
        }
      })
      .catch(err => {
        // 요청을 전달할 수 없음.
        setError(err);
        console.log(err);
      });
  }

  return {
    success,
    loading,
    error,
    handleUpdateRequest,
  };
}
