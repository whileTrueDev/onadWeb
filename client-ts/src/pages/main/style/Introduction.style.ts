import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    padding: '0 10%',
    [theme.breakpoints.down('xs')]: {
      padding: '0 5%',
    }
  },
  wrapper: {
    padding: theme.spacing(15, 0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainTop: {
    margin: theme.spacing(5, 0),
    width: '100%',
  },
  middleLine: {
    width: 350,
    borderBottom: '3px solid #a8deff',
    margin: theme.spacing(1.5, 0),
    [theme.breakpoints.down('xs')]: {
      width: 300,
    }
  },
  middleLine2: {
    width: 350,
    borderBottom: '3px solid #a8ffcd',
    margin: theme.spacing(1.5, 0),
    [theme.breakpoints.down('xs')]: {
      width: 300,
    }
  },
  mainTitle: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('sm')]: {
      fontSize: 36
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 28
    }
  },
  subtitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 28
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  imageWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  glassEffect: {
    display: 'none',
    position: 'absolute',
    pointerEvents: 'none',
    width: 130,
    height: 130,
    background: 'transparent',
    backdropFilter: 'blur(10px)',
    transition: '0.1s'
  },
  topImage: {
    width: '90%',
    margin: theme.spacing(5, 0)
  }

}));

export default styles;
