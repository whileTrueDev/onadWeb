import { Theme, makeStyles } from '@material-ui/core/styles';

const useWithdrawalAgreementStyles = makeStyles((theme: Theme) => ({
  warning: {
    backgroundColor: theme.palette.action.disabledBackground,
    borderLeft: `0.25rem solid ${theme.palette.error.main}`,
    wordBreak: 'keep-all'
  },
  title: {
    marginBottom: 0,
    paddingLeft: 5,
    color: theme.palette.error.main,
    fontFamily: 'Noto Sans KR',
  },
  content: {
    marginBottom: theme.spacing(4),
    paddingLeft: 5,
    marginTop: 3,
    fontSize: 15,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  checked: {},
  checkboxRoot: {
    color: theme.palette.success.main,
    '&$checked': {
      color: theme.palette.success.main,
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 10,
  },
  container: {
    ...theme.mixins.gutters(),
    width: '78%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: '0 auto',
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  inDialogContent: {
    outline: 'none',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
  names: { lineHeight: 1.8 },

}));

export default useWithdrawalAgreementStyles;
