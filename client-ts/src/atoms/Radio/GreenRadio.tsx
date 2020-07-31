import React from 'react';
import { Radio, RadioProps } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

const GreenRadio = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.success.light,
    '&$checked': {
      color: theme.palette.success.main,
    },
    margin: 0,
  },
  checked: {},
}))((props: RadioProps) => (
  <Radio
    color="default"
    size="medium"
    {...props}
  />
));

export default GreenRadio;
