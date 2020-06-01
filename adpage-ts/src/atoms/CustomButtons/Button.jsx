import React from 'react';
// material-ui components
import Button from '@material-ui/core/Button';
// Styles
import useButtonStyles from './Button.style';


function RegularButton({
  color = 'default',
  size = 'large',
  variant = 'contained',
  link,
  children,
  to,
  ...rest
}){
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
