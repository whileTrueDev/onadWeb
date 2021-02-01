import { withStyles, Tooltip } from '@material-ui/core';

const StyledTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.success.light,
    maxWidth: '425px',
  },
  arrow: {
    color: theme.palette.success.light,
    fontSize: theme.spacing(3),
  },
}))(Tooltip);

export default StyledTooltip;
