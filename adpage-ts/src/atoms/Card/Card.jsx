import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import Paper from '@material-ui/core/Paper';
// style
import useCardStyles from './CardStyle';

export default function Card({
  className, children, profile, ...rest
}){
  const classes = useCardStyles();

  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardProfile]: profile,
    [className || '']: className !== undefined,
  });

  return (
    <Paper square className={cardClasses} {...rest}>
      {children}
    </Paper>
  );
}
