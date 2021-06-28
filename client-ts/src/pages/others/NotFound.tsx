import { Link } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OnadLogo from '../../atoms/Logo/OnadLogo';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    height: '100vh',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(10),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(5),
    },
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
  linkButton: {
    textTransform: 'none',
    padding: theme.spacing(2),
  },
}));

export default function NotFound(): JSX.Element {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid className={classes.container} item xs={12}>
        <OnadLogo width={150} />

        <Typography color="textPrimary" variant="h6">
          페이지를 찾을 수 없습니다.
        </Typography>
        <Typography color="textPrimary">
          방문을 원하시는 페이지의 주소가 잘못되었거나 혹은{' '}
        </Typography>
        <Typography color="textPrimary">
          오류 및 변경, 삭제로 인해 요청하신 페이지를 찾을 수 없습니다.
        </Typography>
        <Typography color="textPrimary">
          문의가 필요하시다면, support@onad.io 로 메일을 보내주세요! 빠른 시일내에 답변드릴게요.
        </Typography>

        <br />
        <Button
          className={classes.linkButton}
          color="primary"
          variant="contained"
          size="small"
          to="/"
          component={Link}
        >
          OnAD 메인으로 이동
        </Button>
      </Grid>
    </Grid>
  );
}
