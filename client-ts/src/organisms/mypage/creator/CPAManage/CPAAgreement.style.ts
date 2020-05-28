import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() => ({
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
  },
  stepWrapRed: {
    color: '#00acc1'
  },
  stepWrap2: {
    marginBottom: 20
  },
  stepIMG: {
    width: 200,
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
  }
}));

export default useStyle;
