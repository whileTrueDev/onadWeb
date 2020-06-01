import { useState, useEffect } from 'react';
import axios from 'axios';
import apiHOST from '../../../config/host';

const usePostData = (initialUrl = '', params) => {
  const [param] = useState(params);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [url] = useState(`${apiHOST}${initialUrl}`);

  useEffect(() => {
    const fetchData = async () => {
      setErrorState(false);
      setLoading(true);

      try {
        const response = await axios({
          method: 'POST',
          url,
          data: param
        });

        if (!response.data.error) {
          // api 서버에서 올바른 결과를 받은 경우
          setData(response.data.result);
        } else {
          // 쿼리 결과가 있는 경우
          setErrorState(true);
        }
      } catch (error) {
        // api 요청 과정에서의 오류
        setErrorState(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [param, url]);

  return { data, loading, errorState };
};

export default usePostData;
