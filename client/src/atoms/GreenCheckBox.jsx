import React from 'react';
import { Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const GreenCheckBox = withStyles((theme) => ({
  root: {
    color: theme.palette.success.light,
    '&$checked': {
      color: theme.palette.success.main,
    },
    margin: 0,
  },
  checked: {},
}))(({ ...props }) => (
  <Checkbox
    color="default"
    size="medium"
    icon={<CheckBoxOutlineBlankIcon />}
    checkedIcon={<CheckBoxIcon />}
    {...props}
  />
));

export default GreenCheckBox;
