import { Theme, makeStyles } from '@material-ui/core/styles';

const useCardIconStyle = makeStyles((theme: Theme) => ({
  cardIcon: {
    background: `linear-gradient(60deg, ${theme.palette.info.main}, ${theme.palette.info.main})`,
    padding: '15px',
    marginTop: '-20px',
    marginRight: '15px',
    float: 'left',
  },
  cardIcon2: {
    backgroundColor: '#ffb74d',
    padding: '15px',
    marginTop: '-20px',
    marginRight: '15px',
    float: 'left',
  },
}));

export default useCardIconStyle;
