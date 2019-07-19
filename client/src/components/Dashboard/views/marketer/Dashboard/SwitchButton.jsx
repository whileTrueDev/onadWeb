import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import {
  Switch, FormControlLabel, Typography, makeStyles,
} from '@material-ui/core';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../config';

const IOSSwitch = withStyles(theme => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
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
    border: '1px solid',
    borderColor: theme.palette.grey[300],
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

const useStyle = makeStyles(theme => ({
  typo: {
    marginTop: 15,
    textAlign: 'center',
  },
  switch: {
    textAlign: 'right',
    marginTop: 15,
    marginLeft: 40,
  },
}));

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

function useUpdateData(url, history) {
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

function CustomSwitch(props) {
  const { history } = props;
  const classes = useStyle();

  const url = `${HOST}/api/dashboard/marketer/advertiseOnOff`;
  const { payload, loading, error } = useFetchData(url);
  const { handleSwitch } = useUpdateData(url, history);

  return (
    <div className={classes.typo}>
      {!loading && !error ? (
        <div>
          {payload === true ? (
            <Typography variant="h4">광고ON</Typography>
          ) : (
            <Typography variant="h4" color="secondary">광고OFF</Typography>
          )}
          <FormControlLabel
            className={classes.switch}
            control={(
              <IOSSwitch
                checked={payload}
                onChange={() => handleSwitch({ contraction: !payload })}
              />
               )}
            label="광고ON & OFF"
          />
        </div>
      ) : (
        null
      )}
    </div>
  );
}

CustomSwitch.propTypes = {
  history: PropTypes.object.isRequired,
};

export default CustomSwitch;
