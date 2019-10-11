import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components

const defaultFont = {
  fontFamily: "'Helvetica', 'Nanum Gothic', sans-serif",
  fontWeight: '300',
  lineHeight: '1.5em',
};
const successColor = ['#4caf50', '#66bb6a', '#43a047', '#5cb860'];

const useStyles = makeStyles(() => ({
  defaultFontStyle: {
    ...defaultFont,
    fontSize: '14px',
  },
  successText: {
    color: successColor[0],
  },
}));

function Success({ ...props }) {
  const classes = useStyles();
  const { children } = props;
  return (
    <div className={`${classes.defaultFontStyle} ${classes.successText}`}>
      {children}
    </div>
  );
}

export default Success;
