import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '../../../components/Card/Card';
import IOSSwitch from '../../../components/Switch/IOSSwitch';
import axios from '../../../../../utils/axios';
import history from '../../../../../history';
import useFetchData from '../../../lib/hooks/useFetchData';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '40px',
    padding: theme.spacing(1)
  }
}));

function useUpdateData(url) {
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function handleSwitch(data) {
    // 광고 시작 및 중지
    axios.post(url, data)
      .then((res) => {
        setLoading(false);
        setSuccess(res.data);
        if (res.data) {
          history.push('/dashboard/marketer/main');
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


export default function StatusBar() {
  const classes = useStyles();
  const url = '/api/dashboard/marketer/campaign/onoff';
  const { payload, loading, error } = useFetchData(url);
  const { handleSwitch } = useUpdateData(url, history);

  return (

    <Card style={{ marginBottom: 0 }}>
      <div className={classes.root}>
        <div>
          {!loading && !error && (
          <FormControlLabel
            control={(
              <IOSSwitch
                checked={payload}
                onChange={() => handleSwitch({ contraction: !payload })}
              />
               )}
            label="광고ON & OFF"
          />
          )}
        </div>
        <div>
              운영 상태
        </div>
      </div>
    </Card>
  );
}
