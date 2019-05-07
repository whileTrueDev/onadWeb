import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiSnackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import { CheckCircle } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
  content: {
    backgroundColor: green[600],
    color: theme.palette.text.primary,
    flexWrap: 'inherit',
    [theme.breakpoints.up('md')]: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    },
  },
  contentMessage: {
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
  },
  contentAction: {
    paddingLeft: theme.spacing(2),
  },
  info: {
    flexShrink: 0,
    color: '#fff',
    marginRight: theme.spacing(2),
  },
  close: {
    color: '#fff',
    padding: theme.spacing(1),
  },
});

function Transition(props) {
  return <Slide {...props} direction="down" />;
}

function Snackbar(props) {
  const {
    classes, open, onClose, message, ...other
  } = props;

  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={3000}
      onClose={onClose}
      open={open}
      transition={Transition}
      ContentProps={{
        'aria-describedby': 'snackbar',
        classes: {
          root: classes.content,
          message: classes.contentMessage,
          action: classes.contentAction,
        },
      }}
      message={(
        <React.Fragment>
          <CheckCircle className={classes.info} />
          <span id="snackbar" className={classes.info}>{message}</span>
        </React.Fragment>
      )}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

Snackbar.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  SnackbarContentProps: PropTypes.object,
};

export default withStyles(styles)(Snackbar);
