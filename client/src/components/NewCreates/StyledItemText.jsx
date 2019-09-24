import React from 'react';
import {
  ListItemText
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledItemText = withStyles(theme => ({
  root: {
    color: '#455a64',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
  primary: {
    fontSize: '18px',
    fontWeight: '700'
  },
}))(ListItemText);


export default StyledItemText;
