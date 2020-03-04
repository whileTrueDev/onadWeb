
import React from 'react';
import {
  Input
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledInput = withStyles((theme) => ({
  root: {
    fontSize: '16px',
    fontWeight: '700',
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
}))((props) => (
  <Input
    {...props}
  />
));

export default StyledInput;
