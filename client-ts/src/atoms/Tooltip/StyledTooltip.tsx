import { withStyles, Tooltip } from '@material-ui/core';

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.success.main,
    maxWidth: '425px',
  },
  arrow: {
    color: theme.palette.success.main,
    fontSize: theme.spacing(3),
  },
}))(Tooltip);

export default StyledTooltip;
