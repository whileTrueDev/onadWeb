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
    border: `1px solid #826AEF`,
    marginBottom: 7.5,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  prev: {
    position: 'fixed',
    width: 20,
    height: 20,
    backgroundColor: 'black',
    left: 20,
    bottom: 20,
    display: 'none',
    zIndex: 400,
  },
  next: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    left: 40,
    bottom: 20,
    position: 'fixed',
    display: 'none',
    zIndex: 400,
  }
}));

export default style;
