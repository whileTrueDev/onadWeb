import { Theme, makeStyles } from '@material-ui/core/styles';

const useWithdrawalCompleteStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '5px auto'
  },
  newContentTitle: {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
    fontFamily: 'Noto Sans KR'
  },
  content: {
    color: 'black',
    paddingLeft: 5,
    marginTop: 3,
    fontSize: 15,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  svg: {
    width: '6.5rem',
    height: '6.5rem',
    marginTop: theme.spacing(1),
    fill: theme.palette.secondary.main,
    // marginBottom: theme.spacing(2),
  },
  complete: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.action.disabledBackground,
    paddingBottom: theme.spacing(2),
  },
  circle: {
    width: '12rem',
    height: '12rem',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    borderRadius: '50%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

export default useWithdrawalCompleteStyles;
