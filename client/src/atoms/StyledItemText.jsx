import { ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

// props를 이용한 정의

const StyledItemText = withStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
  primary: (props) => ({
    fontSize: props.fontSize ? props.fontSize : '16px',
    // fontSize: '18px',
    fontWeight: '700',
    color: props.color || theme.palette.text.primary
  }),
}))(ListItemText);


export default StyledItemText;
