import {
  ListItemText
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledSelectText = withStyles((theme) => ({
  primary: (props) => ({
    fontSize: props.fontSize ? props.fontSize : '18px',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
    },
    color: props.color || theme.palette.text.primary
  }),
  secondary: (props) => ({
    fontSize: props.fontSize ? props.fontSize : '13px',
    fontWeight: '500',
    color: props.color || theme.palette.text.secondary
  })
}))(ListItemText);

export default StyledSelectText;
