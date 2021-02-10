import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    padding: '0 10%'
  },
  wrapper: {
    padding: theme.spacing(15, 10),
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
    margin: theme.spacing(1.5,0)
  },
  middleLine2: {
    width: 350,
    borderBottom: '3px solid #a8ffcd',
    margin: theme.spacing(1.5,0)
  },
  mainTitle: {
    fontWeight: theme.typography.fontWeightBold,
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
