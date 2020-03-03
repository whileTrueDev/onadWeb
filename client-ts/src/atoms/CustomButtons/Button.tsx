import React from 'react';
// material-ui components
import Button, { ButtonProps } from '@material-ui/core/Button';
// Styles
import useButtonStyles from './Button.style';

function RegularButton({
  color = 'primary',
  size = 'large',
  variant = 'contained',
  children,
  ...rest
}: ButtonProps): JSX.Element {
  const classes = useButtonStyles();

  return (
    <Button {...rest} size={size} variant={variant} color={color} className={classes.button}>
      {children}
    </Button>
  );
}

export default RegularButton;
