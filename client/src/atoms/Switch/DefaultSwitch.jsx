import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const PurpleSwitch = withStyles(theme => ({
  switchBase: {
    color: '#00acc1',
    '&$checked': {
      color: '#00acc1',
    },
    '&$checked + $track': {
      backgroundColor: '#00acc1',
    },
  },
  checked: {},
  track: {},
}))(Switch);

export default PurpleSwitch;
