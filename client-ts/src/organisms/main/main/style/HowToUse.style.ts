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
  },
  onadVideo: {
    width: 800,
    height: 450
  },
  contentWapper: {
    marginLeft: theme.spacing(8),
    height: 450,
    width: 300,
  },
  content: {
    fontWeight: theme.typography.fontWeightBold,
    marginTop: theme.spacing(0.5)
  },
  bottomLine: {
    borderBottom: '2px solid #20BFE2',
    margin: theme.spacing(1.5, 0),
    animation: '$lineEffect 2s ease-in-out forwards',
  },
  bottomLine2: {
    borderBottom: '2px solid #5ed7ed',
    margin: theme.spacing(1.5, 0),
    animation: '$lineEffect 2s ease-in-out forwards',
  },
  button: {
    borderRadius: 15,
    padding: theme.spacing(1, 2),
    border: `2px solid ${theme.palette.divider}`,
  },
  '@keyframes lineEffect': {
    '0%': { width: '0%' },
    '100%': { width: '100%' },
  },
}));


export default styles;
