import React from 'react';
// @material-ui/core components
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// core components
import useFooterStyle from './Footer.style';

function Footer(): JSX.Element {
  const classes = useFooterStyle();
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
          <Typography variant="body2">
            &copy;
            {`${new Date().getFullYear()} while True Corp. All rights Reserved`}
          </Typography>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
