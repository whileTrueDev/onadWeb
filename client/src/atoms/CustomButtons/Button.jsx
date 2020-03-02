import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import buttonStyle from './Button.style';

function RegularButton({ ...props }) {
  const {
    classes, color, children, variant, ...rest
  } = props;

  return (
    <Button {...rest} variant={variant} color={color} className={classes.button}>
      {children}
    </Button>
  );
}

RegularButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'blueGray',
    'transparent',
  ]),
  variant: PropTypes.string,
  className: PropTypes.string,
};

RegularButton.defaultProps = {
  color: 'primary',
  variant: 'contained'
};

export default withStyles(buttonStyle)(RegularButton);
