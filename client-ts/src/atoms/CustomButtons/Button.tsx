import React from 'react';
// material-ui components
import Button, { ButtonProps } from '@material-ui/core/Button';
// Styles
import useButtonStyles from './Button.style';

interface CustomProps extends ButtonProps {
  to?: string;
  link?: any;
}

function RegularButton({
  color = 'default',
  size = 'large',
  variant = 'contained',
  link,
  children,
  to,
  ...rest
}: CustomProps): JSX.Element {
  const classes = useButtonStyles();

  return (
    <Button
      size={size}
      variant={variant}
      color={color}
      className={classes.button}
      component={link}
      to={to}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default RegularButton;
