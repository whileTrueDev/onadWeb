import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import buttonStyle from './Button.style';

function RegularButton({ ...props }) {
  const {
    classes, color, size, children, variant, ...rest
  } = props;

  return (
    <Button {...rest} size={size} variant={variant} color={color} className={classes.button}>
      {children}
    </Button>
  );
}

RegularButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'default',
    'inherit',
  ]),
  size: PropTypes.oneOf([
    'small',
    'medium',
    'large',
  ]),
  variant: PropTypes.string,
  className: PropTypes.string,
};

RegularButton.defaultProps = {
  color: 'default',
  variant: 'contained',
  size: 'large'
};

export default withStyles(buttonStyle)(RegularButton);
