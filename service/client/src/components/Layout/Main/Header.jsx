import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button, IconButton,

} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const style = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const Header = props => (
  <AppBar
    color="default"
    position="static"
  >
    <Toolbar>
      <Typography
        variant="h6"
        style={{ flex: 1 }}
        color="inherit"
      >
            Onad Logo
      </Typography>
      <Button color="inherit">Login</Button>
    </Toolbar>
  </AppBar>
);


export default Header;
