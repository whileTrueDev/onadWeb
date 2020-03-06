import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
// core components
import { Typography } from '@material-ui/core';
import footerStyle from './Footer.style';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <Button variant="text" href="/policy/privacy" style={{ fontWeight: 'bold' }}>
                개인정보 처리방침
              </Button>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Button variant="text" href="/policy">
                이용약관
              </Button>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          <Typography color="textPrimary">
            &copy;
            2019 while True Corp. All rights Reserved
          </Typography>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(footerStyle)(Footer);
