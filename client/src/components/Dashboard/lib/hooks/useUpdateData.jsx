import React from 'react';
import axios from '../../../../utils/axios';
import host from '../../../../config';

/**
 *
 * @param {*} url 데이터를 수정 또는 삽입요청할 라우터
 * @param {*} callUrl 데이터 조회 요청
 */
export default function useUpdateData(url, callUrl = null) {
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  function handleSwitch(data) {
    // 광고 시작 및 중지
    axios.post(`${host}${url}`, data)
      .then((res) => {
        setLoading(false);
        setSuccess(res.data);
        if (res.data) {
          if (callUrl) {
            callUrl();
          }
        } else {
          alert('잔액이 충분하지 않습니다.');
        }
      }).catch((err) => {
        setError(err);
        console.log(err);
      });
  }

  return {
    success, loading, error, handleSwitch,
  };
}
