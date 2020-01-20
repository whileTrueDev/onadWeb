import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiTypography from '@material-ui/core/Typography';

const styles = theme => ({
  markedH2Center: {
    height: 4,
    width: 73,
    display: 'block',
    margin: `${theme.spacing(1)}px auto 0`,
    backgroundColor: theme.palette.primary.main,
  },
  markedH3Center: {
    height: 4,
    width: 55,
    display: 'block',
    margin: `${theme.spacing(1)}px auto 0`,
    backgroundColor: theme.palette.primary.main,
  },
  markedH4Center: {
    height: 4,
    width: 55,
    display: 'block',
    margin: `${theme.spacing(1)}px auto 0`,
    backgroundColor: theme.palette.primary.main,
  },
  markedH4CenterM: {
    height: 4,
    width: 55,
    display: 'block',
    margin: `${theme.spacing(1)}px auto 0`,
    background: 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)',
  },
  markedH4CenterC: {
    height: 4,
    width: 55,
    display: 'block',
    margin: `${theme.spacing(1)}px auto 0`,
    background: 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)',
  },
  markedH6Left: {
    height: 2,
    width: 28,
    display: 'block',
    marginTop: theme.spacing(0.5),
    background: 'currentColor',
  },
});

const variantMapping = {
  h1: 'h1',
  h2: 'h1',
  h3: 'h1',
  h4: 'h1',
  h5: 'h3',
  h6: 'h2',
  subtitle1: 'h3',
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Typography(props) {
  const {
    children, classes, marked, variant, ...other
  } = props;

  return (
    <MuiTypography variantMapping={variantMapping} variant={variant} {...other}>
      {children}
      {marked ? (
        <span
          className={classes[`marked${capitalizeFirstLetter(variant) + capitalizeFirstLetter(marked)}`]}
        />
      ) : null}
    </MuiTypography>
  );
}

Typography.propTypes = {
  classes: PropTypes.object,
  marked: PropTypes.oneOf([false, 'center', 'left', 'centerC', 'centerM']),
  children: PropTypes.node,
  variant: PropTypes.string,
};

Typography.defaultProps = {
  marked: false,
  classes: {},
};

export default withStyles(styles)(Typography);
