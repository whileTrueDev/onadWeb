import React from 'react';
import {
  Dialog,
  withStyles,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import AccountNumberForm from './AccountNumberForm';

const style = theme => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
  },
  contentText: {
    marginTop: '8px',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionButton: {
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
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
    >
      <AppBar color="primary" position="static" elevation={1}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
          환급 계좌 입력
          </Typography>
          <div className={classes.sectionButton}>
            <IconButton color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <DialogContentText className={classes.contentText}>
          환급 받을 계좌를 입력해주세요.
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
