import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
// import Typography from '../Main/components/Typography';
import Typography from '@material-ui/core/Typography';
import useStyles from './style/AppFooter.style';


function AppFooter(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row-reverse"
        justify="space-between"
        alignItems="center"
        className={classes.iconsWrapper}
      >
        <Grid item>
          <ul className={classes.list}>
            <li>
              <Link
                href="/policy"
                color="inherit"
                underline="none"
                className={classes.listItem}
              >
                이용약관
              </Link>
            </li>
            <li>
              <Link
                href="/policy/privacy"
                color="inherit"
                underline="none"
                style={{ fontWeight: 'bold' }}
                className={classes.listItem}
              >
                개인정보 처리방침
              </Link>
            </li>
          </ul>
        </Grid>
        <Grid item className={classes.icons}>
          <a href="https://on-ad.github.io" className={classes.icon}>
            <img src="/pngs/logo/whileTrue_final.png" id="logo" alt="WhileTrueLogo" width={40} height={40} />
          </a>
          <Typography className={classes.name} variant="body2">
            While True:
          </Typography>
          <br />
        </Grid>
      </Grid>

      <Grid container>
        <Typography variant="caption" className={classes.addressLocation}>
          부산광역시 금정구 장전온천천로 51 테라스파크 3층 313호 와일트루
        </Typography>
      </Grid>

      <Grid container>
        <Typography variant="caption" className={classes.addressTitle}>
          <div>
            대표명
            <span className={classes.address}>강동기</span>
          </div>
          <div>
            이메일
            <span className={classes.address}>support@onad.io</span>
          </div>
          <div>
            사업자등록번호
            <span className={classes.address}>659-03-01549</span>
          </div>
          <div>
            통신판매업 신고번호
            <span className={classes.address}>제2019-부산금정-0581호</span>
          </div>
          <div>
            개인정보보호책임자
            <span className={classes.address}>전민관</span>
          </div>
          <div>
            고객센터
            <span className={classes.address}>051-515-6309</span>
          </div>
        </Typography>
      </Grid>

      <Typography variant="caption" className={classes.corp}>
        <strong>
          &copy;
          while True Corp.
        </strong>
        {' All rights Reserved'}
      </Typography>
    </div>
  );
}
export default AppFooter;
