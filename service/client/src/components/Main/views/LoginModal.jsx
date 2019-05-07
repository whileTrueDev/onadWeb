import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Modal, Typography } from '@material-ui/core';
import clsx from 'clsx';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

const LoginModal = (props) => {
  const { isLoginModalOpen, setisLoginModalOpen, classes } = props;

  function handleClose() {
    setisLoginModalOpen(false);
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={isLoginModalOpen}
      onClose={handleClose}
    >
      <div className={clsx(classes.paper, classes.modal)}>
        <Typography variant="h6" id="modal-title">
      모달창
        </Typography>
        <Typography variant="subtitle1" id="simple-modal-description">
      로그인 폼
        </Typography>
      </div>
    </Modal>
  );
};

LoginModal.propTypes = {
  isLoginModalOpen: PropTypes.bool.isRequired,
  setisLoginModalOpen: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

LoginModal.defaultProps = {
  classes: {},
};

export default withStyles(styles)(LoginModal);
