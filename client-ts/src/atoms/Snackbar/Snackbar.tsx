import React from 'react';
// @material-ui/core components
import Snack, { SnackbarProps as MuiSnackbarProps } from '@material-ui/core/Snackbar';
import Alert, { AlertProps } from '@material-ui/lab/Alert';

interface SnackBarProps extends MuiSnackbarProps {
  color?: AlertProps['color'];
  alertProps?: AlertProps;
  onClose: (event: React.SyntheticEvent, reason?: string) => void;
}

function Snackbar({
  message,
  color = 'success',
  open,
  onClose,
  alertProps,
  anchorOrigin,
  ...rest
}: SnackBarProps): JSX.Element {
  return (
    <Snack
      open={open}
      onClose={onClose}
      autoHideDuration={3000}
      anchorOrigin={anchorOrigin || { vertical: 'bottom', horizontal: 'center' }}
      {...rest}
    >
      <Alert
        severity={color}
        variant="filled"
        elevation={4}
        onClose={onClose}
        style={{ minWidth: 200 }}
        {...alertProps}
      >
        {message}

      </Alert>
    </Snack>
  );
}

export default Snackbar;
