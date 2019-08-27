import React from 'react';
import PropTypes from 'prop-types';
// material ui core components
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// icons
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: '#455a64',
    color: '#FFF',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[100],
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '15px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
        <Grid item>
          <Typography className={classes.title}>{children}</Typography>
        </Grid>
        <Grid item>
          {onClose ? (
            <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>


    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function CustomDialog(props) {
  const {
    title, open, onClose, buttons, children, ...rest
  } = props;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      {...rest}
    >
      { title ? (
        <DialogTitle onClose={onClose}>
          {title}
        </DialogTitle>
      ) : null }
      <DialogContent dividers>
        {children}
      </DialogContent>
      { buttons
        ? (
          <DialogActions>
            {buttons}
          </DialogActions>
        )
        : null}
    </Dialog>
  );
}

CustomDialog.propTypes = {
  title: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  buttons: PropTypes.node,
};

CustomDialog.defaultProps = {
  title: null,
  onClose: null,
  buttons: null,
};

export default CustomDialog;
