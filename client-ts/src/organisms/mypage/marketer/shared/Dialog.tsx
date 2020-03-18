import React from 'react';
// material ui core components
import { withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// icons
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';

const useTitleStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.info.main,
    color: '#FFF',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[300],
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
  },

}));


const DialogTitle = ((props: { children: any, onClose: () => void }) => {
  const { children, onClose } = props;
  const classes = useTitleStyles();
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

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface propInterface {
  title?: string;
  open: boolean;
  onClose: () => void;
  buttons: JSX.Element;
  children: any;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

function CustomDialog(props: propInterface) {
  const {
    title, open, onClose, buttons, children, maxWidth, fullWidth, ...rest
  } = props;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...rest}
    >
      {title ? (
        <DialogTitle onClose={onClose}>
          {title}
        </DialogTitle>
      ) : null}
      <DialogContent style={{ padding: '0 0' }}>
        {children}
      </DialogContent>
      {buttons
        ? (
          <DialogActions>
            {buttons}
          </DialogActions>
        )
        : null}
    </Dialog>
  );
}

export default CustomDialog;
