import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Typography from '../../components/Typography';
import compose from '../../../../utils/compose';

const styles = theme => ({
  '@font-face': {
    fontFamily: 'Noto Sans KR',
    src: 'url(https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap)',
  },
  root: {
    fontFamily: 'Noto Sans KR',
    display: 'flex',
    borderTop: '0.2px solid',

    backgroundColor: '#fff',
  },
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    display: 'flex',
  },
  iconsWrapper: {
    height: 30,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#333',
    marginRight: theme.spacing(1),
    '&:hover': {
      // backgroundColor: '#333',
    },
  },
  name: {
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      width: 20,
      fontSize: 10,
    },
  },
  address: {
    marginLeft: '7px',
    marginRight: '20px',
    fontSize: '12px',
    fontWeight: 300,
  },
  addressTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 'bold',
    fontSize: '12px',
    '& div': {
      display: 'inline-table',
    },
  },
  addressLocation: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 300,
    fontSize: '12px',
  },
  list: {
    margin: 0,
    listStyle: 'none',
  },
  listItem: {
    paddingTop: theme.spacing(0.1),
    paddingBottom: theme.spacing(0.1),
    paddingLeft: '10px',

    '&:hover': {
      fontWeight: 'bold',
    },
    '& a': {
      fontWeight: 300,
      padding: 0,
    },
  },
  corp: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 300,
    marginTop: '12px',
    '& strong': {
      fontWeight: 900,
    },
  },
  right: {
    float: 'right',
    display: 'inline',
  },
});
function AppFooter(props) {
  const { classes } = props;
  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container>
          <Grid
            item
            container
            direction="row-reverse"
            justify="space-between"
            alignItems="center"
            className={classes.iconsWrapper}
          >
            <Grid>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <Link
                    href="/"
                    color="inherit"
                    underline="none"
                  >
                      이용약관
                  </Link>
                </li>
                <li className={classes.listItem}>
                  <Link
                    href="/"
                    color="inherit"
                    underline="none"
                  >
                    개인정보 처리방침
                  </Link>
                </li>
                <li className={classes.listItem}>
                  <Link
                    href="https://on-ad.github.io"
                    color="inherit"
                    underline="none"
                  >
                기술블로그
                  </Link>
                </li>
              </ul>
            </Grid>
            <Grid item className={classes.icons}>
              <a href="https://on-ad.github.io" className={classes.icon}>
                <img src="/pngs/logo/whileTrue_final.png" id="logo" alt="WhileTrueLogo" height={30} />
              </a>
              <Typography className={classes.name} variant="body2">
                {'While True:'}
              </Typography>
              <br />
            </Grid>

          </Grid>
          <Grid container>
            <Typography variant="caption" className={classes.addressLocation}>
              {'부산광역시 금정구 장전온천천로 51 테라스파크 3층 313호 와일트루 '}
            </Typography>
          </Grid>
          <Grid container>
            <Typography variant="caption" className={classes.addressTitle}>
              <div>
                {'대표명'}
                <span className={classes.address}>강동기</span>
              </div>
              <div>
                {'이메일'}
                <span className={classes.address}>support@onad.io</span>
              </div>
              <div>
                {'사업자등록번호'}
                <span className={classes.address}>659-03-01549</span>
              </div>
            </Typography>
          </Grid>

          <Typography variant="caption" className={classes.corp}>
            <strong>
              &copy;
              {'while True Corp.'}
            </strong>
            {' All right Reserved'}
          </Typography>
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
