import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Modal from '@material-ui/core/Modal';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// icons
import Close from '@material-ui/icons/Close';
// core components
import modalStyleStyle from '../../assets/jss/onad/components/modalStyle';

function CustomModal(props) {
  const {
    classes, open, onClose, children, title, color, ...rest
  } = props;

  const appBarClasses = classNames({
    [` ${classes[color]}`]: color,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      {...rest}
    >
      <div className={classes.modal}>
        {/* 상위 바 */}
        <AppBar
          position="static"
          elevation={1}
          className={classNames([classes.appBar, appBarClasses])}
        >
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
            <div className={classes.sectionButton}>
              <IconButton color="inherit" onClick={onClose}>
                <Close />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.inModalContent}>
          {children}
        </div>

      </div>
    </Modal>
  );
}

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  color: PropTypes.oneOf([
    'primary', 'warning', 'danger', 'success',
    'info', 'rose', 'gray', 'blueGray']),
};

CustomModal.defaultProps = {
  title: 'OnAD',
  color: 'blueGray',
};
export default withStyles(modalStyleStyle)(CustomModal);
