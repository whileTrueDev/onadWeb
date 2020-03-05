import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Snack from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Close from '@material-ui/icons/Close';
import Notification from '@material-ui/icons/Notifications';
// core components
import snackbarContentStyle from './Snackbar.style';

function Snackbar({ ...props }) {
  const {
    classes, message, color, close,
    place, icon, open, handleClose, Link,
  } = props;
  let action = [];
  const messageClasses = classNames({
    [classes.iconMessage]: icon !== undefined,
  });
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={() => { handleClose(); }}
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  return (
    <Snack
      onClose={handleClose}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: place.indexOf('t') === -1 ? 'bottom' : 'top',
        horizontal:
          place.indexOf('l') !== -1
            ? 'left'
            : place.indexOf('c') !== -1
              ? 'center'
              : 'right',
      }}
      open={open}
      message={(
        <div>
          {icon !== undefined ? <Notification className={classes.icon} /> : null}
          <span className={messageClasses}>
            {message}
          </span>
          <div style={{ textAlign: 'center' }}>{Link}</div>
        </div>
)}
      action={action}
      ContentProps={{
        classes: {
          root: `${classes.root} ${classes[color]}`,
          message: classes.message,
        },
      }}
    />
  );
}

Snackbar.propTypes = {
  message: PropTypes.node.isRequired,
  classes: PropTypes.object,
  color: PropTypes.oneOf(['info', 'success', 'warning', 'danger', 'primary']),
  close: PropTypes.bool,
  icon: PropTypes.bool,
  place: PropTypes.oneOf(['tl', 'tr', 'tc', 'br', 'bl', 'bc']),
  open: PropTypes.bool.isRequired,
};

Snackbar.defaultProps = {
  color: 'info',
  close: false,
  icon: false,
  place: 'tc'
};

export default withStyles(snackbarContentStyle)(Snackbar);
