import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IOSSwitch from '../../../components/Switch/IOSSwitch';
import useUpdateData from '../../../lib/hooks/useUpdateData';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '40px',
    padding: theme.spacing(1)
  }
}));

export default function StatusBar(props) {
  const { onOffData } = props;
  const classes = useStyles();
  const { handleUpdateRequest } = useUpdateData('/api/dashboard/marketer/onoff', onOffData.callUrl);

  return (

    <div className={classes.root}>
      <div>
        {!onOffData.loading && !onOffData.error && (
          <FormControlLabel
            control={(
              <IOSSwitch
                checked={onOffData.payload}
                onChange={() => handleUpdateRequest({ contraction: !onOffData.payload })}
              />
               )}
            label={onOffData.payload ? '광고 ON' : '광고 OFF'}
          />
        )}
      </div>

      {/* <div>
          운영 상태 :
          {' '}
          {payload ? '광고 ON' : '광고 OFF'}
        </div> */}

    </div>
  );
}

StatusBar.propTypes = {
  onOffData: PropTypes.object
};
StatusBar.defaultProps = {
  onOffData: {
    payload: false,
    loading: true,
    error: '',
    callUrl() {}
  }
};
