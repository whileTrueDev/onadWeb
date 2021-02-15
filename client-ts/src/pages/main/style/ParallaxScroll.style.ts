import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative'
  },
  slide: {
    zIndex: 250,
    height: '100vh',
    position: 'relative'
  },
  slideController: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: '1%',
    zIndex: 250
  },
  slideNum: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    border: '1px solid #826AEF',
    marginBottom: 7.5,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  naviIcon: {
    position: 'fixed',
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: `2px solid ${theme.palette.common.black}`,
    left: 10,
    bottom: 30,
    display: 'none',
    zIndex: 400,
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'inline',
    }
  },
  prev: { transform: 'translate(0%, -60%)' },
  next: { transform: 'translate(0%, 60%)' }
}));

export default style;
