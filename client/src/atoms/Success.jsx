import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components

const defaultFont = {
  fontFamily: "'Helvetica', 'Nanum Gothic', sans-serif",
  fontWeight: '300',
  lineHeight: '1.5em',
};

const useStyles = makeStyles((theme) => ({
  defaultFontStyle: {
    ...defaultFont,
    fontSize: '14px',
  },
  successText: {
    color: theme.palette.success.main,
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
