import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography, Divider } from '@material-ui/core';
import Card from '../../../../../../atoms/Card/Card';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    padding: '14px 20px'
  },
  flex: {
    display: 'flex', alignItems: 'center'
  },
  flexCenter: {
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  contents: {
    padding: '16px 28px', display: 'flex', justifyContent: 'space-between'
  },
  icon: {
    marginRight: '5px'
  },
  value: {
    fontWeight: 700
  },
  primaryColor: {
    color: theme.palette.primary.main
  },
  secondaryColor: {
    color: theme.palette.secondary.main
  }
}));

export default function CardTemplate(props) {
  const classes = useStyles();
  const {
    title, color, IconComponent, children
  } = props;
  const colorClass = color === 'secondary' ? classes.secondaryColor : classes.primaryColor;

  return (
    <Card>
      <div className={classes.container}>
        <div className={classes.flex}>
          <IconComponent
            fontSize="large"
            className={classnames([classes.icon, colorClass])}
          />
          <Typography variant="h5">
            {title}
          </Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.container}>
        {children}
      </div>
    </Card>
  );
}

CardTemplate.propTypes = {
  title: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary']),
  IconComponent: PropTypes.oneOfType([
    PropTypes.element, PropTypes.object
  ])
};
