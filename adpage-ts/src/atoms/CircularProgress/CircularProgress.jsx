import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiCircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItmes: 'center',
  },
  small: {
    height: '22vh'
  },
  large: {
    height: '66vh'
  }
}));

export default function CircularProgress(props) {
  const classes = useStyles();
  const { small, large, ...rest } = props;

  return (
    <div className={classnames(classes.root, { [classes.small]: small, [classes.large]: large })}>
      <MuiCircularProgress {...rest} />
    </div>
  );
}

CircularProgress.propTypes = {
  small: PropTypes.bool,
  large: PropTypes.bool,
};

CircularProgress.defaultProps = {
  small: true,
  large: false
};
