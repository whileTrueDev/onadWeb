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
    width: 400,
    height: 420,
    '&:hover': {
      cursor: 'poiner'
    },
    position: 'relative',
    boxShadow: '0px 2px 5px 3px rgb(0 0 0 / 8%);'
  },
  face: {
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'100%',
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
    width: 400,
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    paddingRight: theme.spacing(2)
  },
  titleBottom: {
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  caption: {
    padding: theme.spacing(2),
    backgroundColor: '#eaeaea',
    transform: 'rotateY(180deg)'
  },
  divider: {
    margin: theme.spacing(1.5, 0)
  }
}));

export default styles;
