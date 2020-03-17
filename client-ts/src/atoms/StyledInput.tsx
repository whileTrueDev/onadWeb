
import React from 'react';
import { Input, InputProps } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

const StyledInput = withStyles((theme: Theme) => ({
  root: {
    fontSize: '16px',
    fontWeight: 700,
    color: theme.palette.text.primary,
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  underline: {
    color: theme.palette.text.primary
  },
}))((props: InputProps) => (
  <Input {...props} />
));

export default StyledInput;
