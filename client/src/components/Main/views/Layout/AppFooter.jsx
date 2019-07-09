import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '../../components/Typography';
import compose from '../../utils/compose';

const styles = theme => ({
  root: {
    display: 'flex',
    borderTop: '0.2px solid',
    // backgroundColor: theme.blueGrey.main,
  },
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
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
    backgroundColor: '#333',
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#333',
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
        <Grid container>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justify="flex-end"
              className={classes.iconsWrapper}
            >
              <Grid item className={classes.icons}>
                <a href="https://on-ad.github.io" className={classes.icon}>
                  <img src="/pngs/whileTrueLogoTemporary.png" alt="WhileTrueLogo" height={50} />
                </a>
              </Grid>
              <Grid item>
                {`${new Date().getFullYear()}`}
                While True:
              </Grid>
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
              {/* <li className={classes.listItem}>
                <Link
                  color="inherit"
                  href="/premium-themes/onepirate/privacy"
                  underline="none"
                >
                고객센터
                </Link>
              </li> */}
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
              {/* <li className={classes.listItem}>
                <Link
                  href="/"
                  color="inherit"
                  underline="none"
                >
                회사 소개
                </Link>
              </li> */}
            </ul>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {'회사명 와일트루 | 회사위치 부산광역시 금정구 장전온천천로 51  3층 313호, 테라스파크 | 대표명 강동기 | 사업자등록번호 659-03-01549 | E-mail : whiletrueceo@gmail.com'}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}

AppFooter.propTypes = {
  classes: PropTypes.object,
};

AppFooter.defaultProps = {
  classes: {},
};

export default compose(
  withStyles(styles),
)(AppFooter);
