import { withStyles, Tooltip } from '@material-ui/core';

const StyledTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.secondary.light,
    maxWidth: '425px',
  },
  arrow: {
    color: theme.palette.secondary.light,
    fontSize: theme.spacing(3),
  },
}))(Tooltip);

export default StyledTooltip;
