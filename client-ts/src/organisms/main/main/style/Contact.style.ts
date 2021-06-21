import makeStyles from '@material-ui/core/styles/makeStyles';

const styles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topLeftLine: {
    marginRight: theme.spacing(4),
    height: 100,
    width: 10,
    borderRadius: 5,
    background: 'linear-gradient(to bottom, #00e2ff, #5800ff)',
    [theme.breakpoints.down('sm')]: {
      height: 80,
    },
    [theme.breakpoints.down('xs')]: {
      height: 100,
    },
  },
  topLeftLine2: {
    marginRight: theme.spacing(4),
    height: 100,
    width: 10,
    borderRadius: 5,
    background: 'linear-gradient(to bottom, #54eacd, #5ed7ed)',
    [theme.breakpoints.down('sm')]: {
      height: 80,
    },
    [theme.breakpoints.down('xs')]: {
      height: 100,
    },
  },
  top: {
    width: '100%',
    height: '50vh',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  topText: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: 30,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  bottom: {
    width: '100%',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#009efd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom2: {
    width: '100%',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#00d1c9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22,
    },
  },
  button: {
    margin: theme.spacing(4, 2, 0, 2),
    width: 250,
    height: 80,
    border: '3px solid white',
    borderRadius: 30,
    '&:hover': {
      background: '#0074d8',
    },
    [theme.breakpoints.down('sm')]: {
      width: 220,
      height: 70,
    },
    [theme.breakpoints.down('xs')]: {
      width: 180,
      height: 60,
    },
  },
  button2: {
    margin: theme.spacing(4, 2, 0, 2),
    width: 250,
    height: 80,
    border: '3px solid white',
    borderRadius: 30,
    '&:hover': {
      background: '#00d1c9',
    },
  },
  waveClosed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

export default styles;
