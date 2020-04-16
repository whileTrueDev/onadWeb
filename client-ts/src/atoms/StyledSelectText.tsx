import { ListItemText, ListItemTextProps } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

interface StyledSelectTextProps extends ListItemTextProps {
  fontSize?: number|string;
}
const StyledSelectText = withStyles((theme: Theme) => ({
  primary: ({ fontSize, color }: {fontSize?: number|string; color?: string}) => ({
    fontSize: fontSize || '18px',
    lineHeight: 2.0,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
    },
    color: color || 'primary'
  }),
  secondary: (props: StyledSelectTextProps) => ({
    fontSize: props.fontSize ? props.fontSize : '13px',
    fontWeight: 500,
    color: props.color || 'secondary'
  })
}))(ListItemText);

export default StyledSelectText;
