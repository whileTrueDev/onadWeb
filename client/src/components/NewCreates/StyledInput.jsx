import React from 'react';
import {
  Input
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledInput = withStyles({
  root: {
    fontSize: '15px',
    color: '#3c4858',
  },
  underline: {
    '&:after': {
      borderBottom: '#3c4858'
    },
    color: '#3c4858'
  },
})(Input);

export default StyledInput;
