import React from 'react';
import {
  Input
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledInput = withStyles(theme => ({
  root: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#3c4858',
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  underline: {
    '&:after': {
      borderBottom: '#3c4858'
    },
    color: '#3c4858'
  },
}))(Input);

export default StyledInput;
