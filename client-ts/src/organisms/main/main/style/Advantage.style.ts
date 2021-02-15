import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.6)'
  },
  contentWrapper: {
    width: 380,
    height: 400,
    '&:hover': {
      cursor: 'poiner'
    },
    position: 'relative',
    boxShadow: '0px 2px 3px 3px rgb(0 0 0 / 8%)',
    [theme.breakpoints.down('md')]: {
      width: 320,
      height: 330,
    },
    [theme.breakpoints.down('sm')]: {
      width: 280,
      height: 290,
    },
    [theme.breakpoints.down('xs')]: {
      width: 210,
      height: 230,
    },
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'all 2s ease'
  },
  figure: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    zIndex: 200
  },
  advImg: {
    width: 380,
    height: 300,
    [theme.breakpoints.down('md')]: {
      width: 320,
      height: 250
    },
    [theme.breakpoints.down('sm')]: {
      width: 280,
      height: 210
    },
    [theme.breakpoints.down('xs')]: {
      width: 210,
      height: 160
    },
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  titleBottom: {
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  caption: {
    hight: '100%',
    backgroundColor: '#eaeaea',
    transform: 'rotateY(180deg)'
  },
  divider: {
    margin: theme.spacing(1.5, 0)
  }
}));

export default styles;
