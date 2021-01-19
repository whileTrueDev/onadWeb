import React, { useEffect, useRef } from 'react';
// material ui style helper, Theme type
import { withStyles, Theme } from '@material-ui/core/styles';
// material ui core components
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// icons
import CloseIcon from '@material-ui/icons/Close';


const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
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
}))(({ children, classes, onClose }:
  { children: React.ReactNode; classes: any; onClose: () => void }) => (
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
));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface CustomDialogProps {
  title?: React.ReactNode;
  open: boolean;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  onClose: () => void;
  [rest: string]: any;
}

function CustomDialog({
  title, open, onClose, buttons, children, ...rest
}: CustomDialogProps): JSX.Element {
  const contentRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  });
  return (
    <Dialog
      onClose={onClose}
      open={open}
      {...rest}
    >
      {title ? (
        <DialogTitle onClose={onClose}>
          {title}
        </DialogTitle>
      ) : null}
      <DialogContent dividers ref={contentRef}>
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
