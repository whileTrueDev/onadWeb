import makeStyles from '@material-ui/core/styles/makeStyles';

const styles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  topLeftLine: {
    marginRight: theme.spacing(4),
    height: 100,
    width: 10,
    borderRadius: 5,
    background: 'linear-gradient(to bottom, #00e2ff, #5800ff)',
  },
  topLeftLine2: {
    marginRight: theme.spacing(4),
    height: 100,
    width: 10,
    borderRadius: 5,
    background: 'linear-gradient(to bottom, #54eacd, #5ed7ed)',
  },
  top: {
    width: '100%',
    height: '50vh',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topText: {
    fontWeight: theme.typography.fontWeightBold
  },
  bottom: {
    width: '100%',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#009efd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottom2: {
    width: '100%',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#00d1c9',
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  bottomText: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.common.white
  },
  button: {
    marginTop: theme.spacing(4),
    width: 250,
    height : 80,
    border: '3px solid white',
    borderRadius: 30,
    '&:hover': {
      background: '#0074d8'
    }
  },
  button2: {
    marginTop: theme.spacing(4),
    width: 250,
    height : 80,
    border: '3px solid white',
    borderRadius: 30,
    '&:hover': {
      background: '#00d1c9'
    }
  },
  waveClosed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
}));

export default styles;
