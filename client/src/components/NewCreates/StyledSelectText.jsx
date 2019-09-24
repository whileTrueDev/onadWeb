import React from 'react';
import {
  ListItemText
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledSelectText = withStyles(theme => ({
  primary: {
    fontSize: '18px',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
    },
  },
  secondary: {
    fontSize: '13px',
    fontWeight: '500',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0px',
    },
  }

}))(ListItemText);

export default StyledSelectText;
