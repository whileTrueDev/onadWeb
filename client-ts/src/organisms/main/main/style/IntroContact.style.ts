import makeStyles from '@material-ui/core/styles/makeStyles';

const styles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    width: '100%',
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
    [theme.breakpoints.down('xs')]: {
      height: 300,
    },
  },
  bottom: {
    background: '#009efd',
    width: '100%',
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
    [theme.breakpoints.down('xs')]: {
      height: 300,
    },
  },
  bottom2: {
    background: '#00d1c9',
    width: '100%',
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
    [theme.breakpoints.down('xs')]: {
      height: 300,
    },
  },
  bottomText: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      fontSize: 45
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 32
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    },
  },
  button: {
    margin: theme.spacing(4, 2, 0, 2),
    width: 250,
    height: 80,
    border: '3px solid white',
    borderRadius: 30,
    '&:hover': {
      background: '#0074d8'
    },
    [theme.breakpoints.down('md')]: {
      width: 210,
      height: 70,
    },
    [theme.breakpoints.down('sm')]: {
      width: 180,
      height: 60,
    },
    [theme.breakpoints.down('xs')]: {
      width: 150,
      height: 50,
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
      opacity: 0.5
    },
    [theme.breakpoints.down('md')]: {
      width: 210,
      height: 70,
    },
    [theme.breakpoints.down('sm')]: {
      width: 180,
      height: 60,
    },
    [theme.breakpoints.down('xs')]: {
      width: 150,
      height: 50,
    },
  },
  waveClosed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
}));

export default styles;
