import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '../../../atoms/Card/Card';
import IOSSwitch from '../../../atoms/Switch/IOSSwitch';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';

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
    <Card style={{ marginBottom: 0 }}>
      <div className={classes.root}>
        <div style={{ margin: 16 }}>
          {!onOffData.loading && !onOffData.error && (
          <FormControlLabel
            control={(
              <IOSSwitch
                checked={onOffData.payload.onOff}
                onChange={() => handleUpdateRequest({ contraction: !onOffData.payload.onOff })}
              />
               )}
            label={onOffData.payload.onOff ? '광고 ON' : '광고 OFF'}
          />
          )}
        </div>
      </div>
    </Card>
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
