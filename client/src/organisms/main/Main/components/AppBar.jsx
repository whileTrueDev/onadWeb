import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';

const styles = theme => ({
  root: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightRegular,
  },
});

// function AppBar(props) {
//   return <MuiAppBar elevation={0} position="static" {...props} />;
// }

class AppBar extends React.Component {
  render() {
    return (
      <MuiAppBar elevation={0} position="static" {...this.props} />
    );
  }
}

export default withStyles(styles)(AppBar);
