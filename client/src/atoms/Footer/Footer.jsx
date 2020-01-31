import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
// core components
import footerStyle from '../../assets/jss/onad/components/footerStyle';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="/policy/privacy" className={classes.block} style={{ fontWeight: 'bold' }}>
                개인정보 처리방침
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="/policy" className={classes.block}>
                이용약관
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy;
            {`${1900 + new Date().getYear()} while True Corp. All rights Reserved`}
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(footerStyle)(Footer);
