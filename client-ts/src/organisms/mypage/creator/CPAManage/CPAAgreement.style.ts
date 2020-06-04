import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyle = makeStyles((theme: Theme) => ({
  text: {
    fontFamily: 'Noto Sans KR',
    fontSize: 15
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepTitle: {
    marginRight: 10
  },
  stepExplain: {
    margin: '20px 0 20px 0'
  },
  stepWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
  },
  stepDetailWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepWrapRed: {
    color: theme.palette.primary.main
  },
  stepWrap2: {
    marginBottom: 20
  },
  stepIMG: {
    width: 150,
    height: 150,
    margin: 'auto'
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrap: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  agreementWrap: {
    width: '100%',
    height: 200,
    overflow: 'auto',
    border: `1px solid ${theme.palette.primary.dark}`,
    borderRadius: 3,
  },
  endButton: {
    padding: '10px 0px',
    display: 'flex',
    justifyContent: 'center'
  }
}));

export default useStyle;
