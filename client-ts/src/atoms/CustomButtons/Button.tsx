import React from 'react';
// material-ui components
import Button, { ButtonProps } from '@material-ui/core/Button';
// Styles
import {
  CircularProgress
} from '@material-ui/core';
import useButtonStyles from './Button.style';

interface CustomProps extends ButtonProps {
  to?: string;
  link?: any;
  load?: boolean;
}

function RegularButton({
  color = 'default',
  size = 'large',
  variant = 'contained',
  onClick,
  load,
  link,
  children,
  to,
  ...rest
}: CustomProps): JSX.Element {
  const classes = useButtonStyles();
  const [isloading, setIsLoading] = React.useState(false);

  function handleClick(): void {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Button
      size={size}
      variant={variant}
      color={color}
      className={classes.button}
      component={link}
      disabled={load && isloading}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onClick) onClick(e);
        if (load) {
          handleClick();
        }
      }}
      to={to}
      {...rest}
    >
      {children}
      {isloading && (
        <CircularProgress
          disableShrink
          size={16}
          thickness={5}
          variant="indeterminate"
        />
      )}
    </Button>
  );
}

export default RegularButton;
