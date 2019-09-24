import React, { useReducer } from 'react';
import { Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { green } from '@material-ui/core/colors';

const GreenCheckBox = withStyles(theme => ({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
    margin: 0,
  },
  checked: {},
}))(props => (
  <Checkbox
    color="default"
    fontSize="large"
    icon={<CheckBoxOutlineBlankIcon fontSize={props.fontSize} />}
    checkedIcon={<CheckBoxIcon fontSize={props.fontSize} />}
    {...props}
  />
));

export default GreenCheckBox;
