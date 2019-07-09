import React from 'react';
import {
  withStyles,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Dialog from '../../../components/Dialog/Dialog';
import AccountNumberForm from './AccountNumberForm';

const style = theme => ({
  contentText: {
    marginTop: '8px',
    fontSize: 15,
    fontWeight: '700',
  },
});


const AccountDialog = (props) => {
  const {
    classes, open, handleDialogClose, history,
  } = props;

  const handleClose = () => {
    handleDialogClose(false);
  };

  return (
    <Dialog
      maxWidth="xl"
      open={open}
      onClose={handleClose}
      title="출금 계좌 입력"
    >
      <DialogContent>
        <DialogContentText className={classes.contentText}>
          출금 받을 계좌를 입력해주세요.
        </DialogContentText>
        <AccountNumberForm history={history} handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

AccountDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(style)(AccountDialog);
