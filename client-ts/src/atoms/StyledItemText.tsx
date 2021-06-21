import { ListItemText } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

// props를 이용한 정의

const StyledItemText = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.primary,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
  primary: ({ fontSize, color }: { fontSize?: string; color?: string }) => ({
    fontSize: fontSize || '16px',
    fontWeight: 700,
    color: color || theme.palette.text.primary,
  }),
}))(ListItemText);

export default StyledItemText;
