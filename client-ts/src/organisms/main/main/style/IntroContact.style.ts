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
    position: 'relative'
  },
  bottom: {
    background: '#009efd',
    width: '100%',
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom2: {
    background: '#00d1c9',
    width: '100%',
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  waveClosed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
}));

export default styles;
