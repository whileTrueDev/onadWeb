import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    borderRadius: 0,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamilySecondary,
    padding: theme.spacing(2, 2),
    fontSize: theme.typography.pxToRem(14),
    boxShadow: 'none',
    '&:active, &:focus': {
      boxShadow: 'none',
    },
  },
  sizeSmall: {
    padding: theme.spacing(1, 3),
    fontSize: theme.typography.pxToRem(13),
  },
  sizeLarge: {
    padding: theme.spacing(2, 3),
    fontSize: theme.typography.pxToRem(15),
  },
}));

export default function Button(props) {
  const { children } = props;
  const classes = useStyles();
  return (<MuiButton classes={classes} {...props}>{children}</MuiButton>);
}
