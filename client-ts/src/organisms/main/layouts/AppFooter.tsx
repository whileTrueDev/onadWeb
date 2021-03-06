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
                variant="body1"
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
                variant="body1"
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
          <Typography className={classes.name} variant="h5" display="inline">
            While True
          </Typography>
          <img src="/logo/iconLogo.png" alt="iconlogo" className={classes.iconLogo} />
        </Grid>
      </Grid>

      <Grid container direction="row" style={{ marginBottom: '12px' }} className={classes.Wrapper}>
        <Typography variant="subtitle2" className={classes.addressLocation}>
          부산광역시 금정구 장전온천천로 51 테라스파크 3층 313호 와일트루
        </Typography>
        <div className={classes.logoWrapper}>
          <a href="https://m.blog.naver.com/PostList.nhn?blogId=wt_onad">
            <img src="/footer/blog.svg" alt="blog" className={classes.logo} />
          </a>
          <a href="https://www.instagram.com/official.onad/">
            <img src="/footer/instagram.svg" alt="instagram" className={classes.logo} />
          </a>
          <a href="https://www.youtube.com/channel/UCN3w7jS8f6t2fPROcRY7e0g">
            <img src="/footer/youtube.svg" alt="youtube" className={classes.logo} />
          </a>
        </div>
      </Grid>

      <Grid container>
        <Typography variant="subtitle2" className={classes.addressTitle}>
          <div>
            대표명
            <span className={classes.address}>강동기</span>
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
            이메일
            <span className={classes.address}>support@onad.io</span>
          </div>
          <div>
            고객센터
            <span className={classes.address}>051-515-6309</span>
          </div>
        </Typography>
      </Grid>

      <Typography variant="caption" className={classes.corp}>
        <strong>&copy; while True Corp.</strong>
        {' All rights Reserved'}
      </Typography>
    </div>
  );
}
export default AppFooter;
