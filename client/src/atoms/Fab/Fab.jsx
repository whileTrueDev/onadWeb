import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';

import buttonStyle from '../../assets/jss/onad/components/buttonStyle';

function CustomFab({ ...props }) {
  const {
    classes, color, children, className, muiClasses,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes[color]]: color,
    [className]: className,
  });
  return (
    <Fab {...rest} className={btnClasses}>
      {children}
    </Fab>
  );
}

CustomFab.propTypes = {
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
  className: PropTypes.string,
  // use this to pass the classes props from Material-UI
  muiClasses: PropTypes.object,
};

export default withStyles(buttonStyle)(CustomFab);
