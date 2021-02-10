import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(5, 0),
  },
  creatorUse: {
    padding: theme.spacing(3, 4),
    wordBreak: 'keep-all',
    hegiht: 250,
    borderTop: '1px solid #29e3dc',
    borderLeft: '1px solid #29e3dc',
    borderBottom: '1px solid #29e3dc',
    position: 'relative'
  },
  lineDecoration: {
    width: 130,
    position: 'absolute',
    left: -1,
    top: -5,
    borderBottom: '5px solid #29e3dc'
  },
  subTitle: {
    fontFamily: 'Noto Sans kr',
    color: 'white',
    margin: theme.spacing(2, 0)
  },
  useNumber: {
    color: '#29e3dc',
    fontWeight: theme.typography.fontWeightBold
  },
  Content: {
    marginTop: theme.spacing(2),
    fontSize: 15
  },
  sampleLink: {
    fontFamily: 'Noto Sans kr',
    border: '1px solid black',
    borderRadius: 10,
    width: 100,
    fontSize: 16,
    marginTop: 20
  },
  contentImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semiTitle: {
    color: '#29e3dc',
    fontFamily: 'Noto Sans kr',
    fontWeight: theme.typography.fontWeightBold
  }
}));

export default useStyles;
