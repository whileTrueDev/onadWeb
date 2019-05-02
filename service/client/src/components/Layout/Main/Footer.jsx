import React from 'react';
import {
  Paper,
  Typography,
} from '@material-ui/core';

const Footer = () => (
  <Paper style={{
    boxShadow: 'none',
    borderTop: '1px solid #ddd',
  }}
  >
    <Typography align="center" variant="h5" component="h3">
      Footer Paper
    </Typography>
    <Typography align="center" component="p">
      Footer content
    </Typography>
  </Paper>
);

export default Footer;
