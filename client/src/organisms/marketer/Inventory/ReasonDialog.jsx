import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  head: {
    fontSize: '20px',
    fontWeight: '600',
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h5" className={classes.head}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },

}))(MuiDialogContent);

const dialogStyle = {
  reason: {
    marginTop: '10px',
    margin: '7px',
    fontSize: '16px',
    fontWeight: '500',
  },
  company: {
    marginTop: '10px',
    textAlign: 'right',
    margin: '7px',
    fontSize: '20px',
    fontWeight: '700',
  },
  time: {
    textAlign: 'right',
  },
};

const ReasonDialog = (props) => {
  const {
    open, handleOpen, banner, classes,
  } = props;
  const { bannerDenialReason, bannerSrc, date } = banner;
  return (
    <Dialog
      onClose={handleOpen}
      open={open}
    >
      <DialogTitle onClose={handleOpen}>
            거절사유
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <img src={bannerSrc} alt={bannerDenialReason} />
        </Typography>
        <Divider />
        <Typography gutterBottom className={classes.reason}>
          {`귀하의 배너가 ${bannerDenialReason} 의 이유로 거절되었음을 알립니다.`}
        </Typography>
        <Typography gutterBottom className={classes.company}>
          온애드
        </Typography>
        <Typography gutterBottom className={classes.time}>
          {date}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default withStyles(dialogStyle)(ReasonDialog);
