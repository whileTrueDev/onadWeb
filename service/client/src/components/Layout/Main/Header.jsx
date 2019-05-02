import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import ProductHero from './ProductHero';


const Header = props => (
  <div>
    <AppBar
      color="none"
      position="static"
      style={{
        top: '0',
        boxShadow: 'none',
        borderBottom: '1px solid #ddd',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          style={{ flex: 1 }}
          color="inherit"
        >
        Onad Logo
        </Typography>
        <Button color="inherit">로그인</Button>

        <Button color="inherit">회원가입</Button>
      </Toolbar>
    </AppBar>

    <ProductHero />
  </div>
);


export default Header;
