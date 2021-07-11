import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  containerWrap: {
    background: 'linear-gradient(to bottom, #fff, #dfe9f3)',
    marginTop: theme.spacing(8),
    width: '100%',
    display: 'flex',
    height: 700,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down('md')]: {
      height: 600,
    },
    [theme.breakpoints.down('sm')]: {
      height: 500,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(5),
    },
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    padding: '5% 15%',
    [theme.breakpoints.down('md')]: {
      padding: '5% 3%',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '5% 1%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '10% 0%',
    },
  },
  liveContainer: {
    overflowX: 'scroll',
    width: '100%',
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: theme.spacing(3, 0),
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
    [theme.breakpoints.down('xs')]: {
      height: 110,
    },
  },
  liveCreatorWrapper: {
    borderRadius: '50%',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    margin: theme.spacing(2, 2),
    width: 160,
    height: 160,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 100,
      height: 100,
    },
    [theme.breakpoints.down('xs')]: {
      width: 60,
      height: 60,
    },
  },
  liveCreator: {
    margin: theme.spacing(2, 2),
    width: 150,
    height: 150,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 90,
      height: 90,
    },
    [theme.breakpoints.down('xs')]: {
      width: 50,
      height: 50,
    },
  },
  creatorLogoWrapper: {
    borderRadius: '50%',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    margin: theme.spacing(1, 5),
    width: 60,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorLogo: {
    width: 50,
    height: 50,
    borderRadius: '50%',
  },
  columnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  columnText: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default useStyles;
