import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core';

import HeadPopover from './headerPopover';

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

      <HeadPopover type='로그인'/>
      <HeadPopover type='회원가입'/>
    </Toolbar>
  </AppBar>
);


export default Header;