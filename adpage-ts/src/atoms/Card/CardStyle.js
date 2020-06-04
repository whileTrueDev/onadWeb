import { makeStyles } from '@material-ui/core/styles';
import {
  hexToRgb,
} from '../../assets/jss/onad';

const useStyles = makeStyles((theme) => ({
  card: {
    border: '0',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    width: '100%',
    boxShadow: `0 1px 4px 0 rgba(${hexToRgb(theme.palette.common.black)}, 0.14)`,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    wordWrap: 'break-word',
    fontSize: '.875rem',
  },
  cardProfile: {
    marginTop: '20px',
    textAlign: 'center',
  }
}));

export default useStyles;
