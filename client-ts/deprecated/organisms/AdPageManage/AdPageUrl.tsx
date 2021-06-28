import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Card from '../../../../atoms/Card/Card';
import CardBody from '../../../../atoms/Card/CardBody';
import AdPageData from './AdPageData.interfece';

const useStyles = makeStyles(theme => ({
  card: { marginBottom: theme.spacing(1) },
  root: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  site: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

interface AdPageUrlProps {
  userData: AdPageData;
}
export default function AdPageUrl({ userData }: AdPageUrlProps): JSX.Element {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardBody>
        <div className={classes.root}>
          <Typography variant="body1">내 광고페이지 주소&emsp;</Typography>
          <Typography
            className={classes.site}
            variant="body1"
            onClick={(): void => {
              window.open(`https://l.onad.io/${userData.creatorTwitchId}`);
            }}
          >
            {`https://l.onad.io/${userData.creatorTwitchId}`}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}
