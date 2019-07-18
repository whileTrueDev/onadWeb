import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import axios from '../../../../../utils/axios';

import setChartjsData from '../../../variables/charts';
import HOST from '../../../../../config';
// data Fetch hooks
function useFetchData(url, dateRange) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url, {
        params: { dateRange },
      });
      if (res.data.length !== 0) {
        setPayload(res.data);
      } else {
        console.log(res);
        setError('데이터가 없습니다.');
        // throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError('오류입니다.');
    } finally {
      setLoading(false);
    }
  }, [url, dateRange]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

function ValueChart() {
  const valueChartData = useFetchData(`${HOST}/api/dashboard/marketer/bannerValue`);

  return (
    <div>
      { valueChartData.loading && (<div style={{ textAlign: 'center' }}><CircularProgress /></div>)}
      { !valueChartData.loading && valueChartData.error && (
        <div>
          <Typography variant="h6">데이터가 없어요! 광고를 진행하세요.</Typography>
          <Line
            data={setChartjsData([], [], '노출량')}
            options={{ tooltips: { mode: 'index', intersect: false } }}
          />
        </div>
      )}
      { !valueChartData.loading && valueChartData.payload && (
        <Line
          data={setChartjsData(valueChartData.payload.labels, valueChartData.payload.dataSet, '노출량')}
          options={{ tooltips: { mode: 'index', intersect: false } }}
        />
      )}
    </div>
  );
}

export default ValueChart;
