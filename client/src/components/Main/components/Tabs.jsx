import withStyles from '@material-ui/core/styles/withStyles';
import MuiTabs from '@material-ui/core/Tabs';

const styles = theme => ({
  indicator: {
    backgroundColor: theme.palette.common.white,
  },
});

export default withStyles(styles)(MuiTabs);
