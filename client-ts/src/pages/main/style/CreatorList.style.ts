import makeStyles from '@material-ui/core/styles/makeStyles';



const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(to bottom, #fff, #dfe9f3)',
    marginTop: theme.spacing(8),
    width: '100%',
    height: '700px',
    [theme.breakpoints.down('md')]: {
      height: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '600px'
    }
  },
  containerWrap: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing(5)
  },
  title: {
    fontWeight: theme.typography.fontWeightBold
  },
  mainImage: {
    width: '100%',
    height: '100%'
  },
  wrapper: {
    padding: '5% 15%'
  },
  liveContainer: {
    overflowX: 'scroll',
    width: '100%',
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: theme.spacing(3, 0)
  },
  liveCreatorWrapper: {
    borderRadius: '50%',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    margin: theme.spacing(2,2),
    width: 160,
    height: 160,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  liveCreator: {
    margin: theme.spacing(2,2),
    width: 150,
    height: 150,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  creatorLogoWrapper: {
    borderRadius: '50%',
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    margin: theme.spacing(1,5),
    width: 60,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
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
    alignItems: 'center'
  },
  columnText: {
    fontWeight: theme.typography.fontWeightBold
  }
}));

export default useStyles;
