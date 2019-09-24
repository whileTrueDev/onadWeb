import React from 'react';
import classnames from 'classnames';
import MuiCircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  big: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(15),
  }
}));

export default function CircularProgress(props) {
  const { small, ...rest } = props;
  const classes = useStyles();

  return (
    <div>
      { small ? (
        <div className={classes.wrapper}>
          <MuiCircularProgress {...rest} />
        </div>
      ) : (
        <div className={classnames([classes.wrapper, classes.big])}>
          <MuiCircularProgress {...rest} />
        </div>
      )}
    </div>
  );
}
