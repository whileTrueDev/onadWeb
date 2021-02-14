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
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  onadVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    visibility: 'hidden',
  },
  onadVideoReady: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    animation: '$flow 1s ease-in-out forwards'
  },
  '@keyframes flow': {
    '0%, 50%': {
      visibility: 'hidden',
      transform: 'translate(0%, 10%)',
      opacity: 0
    },
    '100%': {
      visibility: 'visible',
      transform: 'translate(0%, 0%)',
      opacity: 1
    }
  },
  contentWapper: {
    marginLeft: theme.spacing(8),
    height: 450,
    width: 300,
    [theme.breakpoints.down('md')]: {
      height: 350,
      marginLeft: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      height: 280,
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      height: 220,
    },
  },
  content: {
    fontWeight: theme.typography.fontWeightBold,
    marginTop: theme.spacing(0.5),
  },
  bottomLine: {
    borderBottom: '2px solid #20BFE2',
    margin: theme.spacing(3, 0),
    animation: '$lineEffect 2s ease-in-out forwards',
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(1.5, 0),
    }
  },
  bottomLine2: {
    borderBottom: '2px solid #5ed7ed',
    margin: theme.spacing(3, 0),
    animation: '$lineEffect 2s ease-in-out forwards',
  },
  button: {
    borderRadius: 15,
    padding: theme.spacing(1, 2),
    border: `2px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('xs')]: {
      width: 170,
      height: 50
    }
  },
  '@keyframes lineEffect': {
    '0%': { width: '0%' },
    '100%': { width: '200%' },
  },
  iframeWrapper: {
    position: 'relative',
    width: '50%',
    padding: '28.125% 0 0 0',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      padding: '50.625% 0 0 0',
    }
  },
  download: {
    color: 'black',
    [theme.breakpoints.down('xs')]: {
      fontSize: 15
    }
  }
}));


export default styles;
