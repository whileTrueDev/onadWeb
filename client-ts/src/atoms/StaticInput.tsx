import React from 'react';
import { Input, InputProps } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

// 폰트 사이즈 고정인 input (PlatformRegistForm)
const StaticInput = withStyles((theme: Theme) => ({
  root: {
    fontSize: '16px',
    color: theme.palette.text.primary,
    width: '300px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      fontSize: '16px',
      margin: 0,
    },
  },
  underline: {
    color: theme.palette.text.primary,
  },
}))((props: InputProps) => <Input {...props} />);

export default StaticInput;
