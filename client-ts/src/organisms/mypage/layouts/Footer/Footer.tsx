import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// core components
import useFooterStyle from './Footer.style';

function Footer(): JSX.Element {
  const classes = useFooterStyle();
  return (
    <footer className={classes.footer}>
      <div className={classes.flex}>
        <Button variant="text" href="/policy/privacy" style={{ fontWeight: 'bold' }}>
          개인정보 처리방침
        </Button>
        <Button variant="text" href="/policy">
          이용약관
        </Button>
      </div>
      <div className={classes.flex}>
        <Typography variant="body2" color="textSecondary">
          &copy;
          {`${new Date().getFullYear()} while True Corp. All rights Reserved`}
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
