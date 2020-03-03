import React from 'react';
// @material-ui/core components
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
// core components
import useFooterStyle from './Footer.style';

function Footer() {
  const classes = useFooterStyle();
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
            2019 while True Corp. All rights Reserved
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
