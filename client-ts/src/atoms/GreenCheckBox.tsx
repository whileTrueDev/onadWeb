import React from 'react';
<<<<<<< HEAD
import { Checkbox } from '@material-ui/core';
import { CheckboxProps } from '@material-ui/core/Checkbox'
=======
import { Checkbox, CheckboxProps } from '@material-ui/core';
>>>>>>> c13cb7d411cc9a8f7c77f16183e14731c26a8f09
import { withStyles, Theme } from '@material-ui/core/styles';
// icons
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';


const GreenCheckBox = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.success.light,
    '&$checked': {
      color: theme.palette.success.main,
    },
    margin: 0,
  },
  checked: {},
}))((props: CheckboxProps) => (
  <Checkbox
    color="default"
    size="medium"
    icon={<CheckBoxOutlineBlankIcon />}
    checkedIcon={<CheckBoxIcon />}
    {...props}
  />
));

export default GreenCheckBox;
