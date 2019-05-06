import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { blueGrey } from '@material-ui/core/colors';
import Typography from '../components/Typography';
import compose from '../utils/compose';

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: blueGrey[100],
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc071',
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#ffb25e',
    },
  },
  list: {
    margin: 0,
    listStyle: 'none',
    paddingLeft: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    '&:hover': {
      fontWeight: 'bold',
    },
  },
});

function AppFooter(props) {
  const { classes } = props;

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justify="flex-end"
              className={classes.iconsWrapper}
              spacing={2}
            >
              <Grid item className={classes.icons}>
                <a href="https://on-ad.github.io" className={classes.icon}>
                  <img src="/images/appFooterFacebook.png" alt="Facebook" />
                </a>
              </Grid>
              <Grid item>© 2019 Onad</Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Link
                  href="/premium-themes/onepirate/terms"
                  color="inherit"
                  underline="none"
                >
                이용약관
                </Link>
              </li>
              <li className={classes.listItem}>
                <Link
                  href="/premium-themes/onepirate/privacy"
                  color="inherit"
                  underline="none"
                >
                개인정보 처리방침
                </Link>
              </li>
              <li className={classes.listItem}>
                <Link
                  color="inherit"
                  href="/premium-themes/onepirate/privacy"
                  underline="none"
                >
                고객센터
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Contact Us
            </Typography>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Link
                  href="https://on-ad.github.io"
                  color="inherit"
                  underline="none"
                >
                기술블로그
                </Link>
              </li>
              <li className={classes.listItem}>
                <Link
                  href="/"
                  color="inherit"
                  underline="none"
                >
                회사 소개
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {'회사명 온애드 | 회사위치 어딘가 | 대표명 누군가 사업자등록번호 몇번 | 통신판매업신고번호 몇번 | E-mail : support@on.ad'}
              <Link
                href="/"
                title="some link"
                target="_blank"
                rel="somelink"
              >
                some link
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}

AppFooter.propTypes = {
  classes: PropTypes.shape(PropTypes.object),
};

export default compose(
  withStyles(styles),
)(AppFooter);
