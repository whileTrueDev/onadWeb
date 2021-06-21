import { Theme, makeStyles } from '@material-ui/core/styles';

const useWithdrawalAmountStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '5px auto',
  },
  contentTitle: { fontWeight: 'bold' },
  newContentTitle: {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  warningTitle: {
    fontWeight: 'bold',
  },
  contentDetail: {
    marginTop: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
    fontSize: 16,
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingLeft: 5,
    marginTop: 3,
    fontSize: 12,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  warning: {
    background: theme.palette.action.disabledBackground,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default useWithdrawalAmountStyles;
