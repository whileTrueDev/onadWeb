import React, { useState, useEffect, useCallback } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { Switch, FormControlLabel } from '@material-ui/core';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../config';
import history from '../../../../../history';

const IOSSwitch = withStyles(theme => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(2),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => (
  <Switch
    focusVisibleClassName={classes.focusVisible}
    disableRipple
    classes={{
      root: classes.root,
      switchBase: classes.switchBase,
      thumb: classes.thumb,
      track: classes.track,
      checked: classes.checked,
    }}
    {...props}
  />
));

// data Fetch hooks
function useFetchData(url, params) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url, params);
      setPayload(res.data);
    } catch {
      setError('오류입니다.');
    } finally {
      setLoading(false);
    }
  }, [params, url]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return { payload, loading, error };
}

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

function CustomSwitch() {
  const url = `${HOST}/api/dashboard/marketer/campaign/onoff`;
  const { payload, loading, error } = useFetchData(url);
  const { handleSwitch } = useUpdateData(url, history);

  return (
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
  );
}

export default CustomSwitch;
