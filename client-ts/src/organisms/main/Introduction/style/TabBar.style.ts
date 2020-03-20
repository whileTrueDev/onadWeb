import { makeStyles } from '@material-ui/core/styles';

const ORANGE_BACKGROUND = 'linear-gradient(45deg, #FFAA00 30%, #FF8E53 90%)';
const EMERALD_BACKGROUND = 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)';

const useStyles = makeStyles((theme) => ({
  tabs: {
    flexGrow: 1,
    marginBottom: theme.spacing(5),
    boxShadow: 'none',
    zIndex: 3,
  },
  tab: {
    height: 50,
    background: ORANGE_BACKGROUND,
    color: 'white',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: 600,
  },
  tab2: {
    height: 50,
    background: EMERALD_BACKGROUND,
    color: 'white',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: 600,
  },
  tab3: {
    height: 50,
    backgroundColor: 'white',
    color: 'gray',
    fontFamily: 'Noto Sans Kr',
    fontSize: 16,
    fontWeight: 600,
  },
  indicator_marketer: {
    indicator: {
      backgroundColor: EMERALD_BACKGROUND
    }
  },
  indicator_creator: {
    indicator: {
      backgroundColor: ORANGE_BACKGROUND
    }
  }
}));

export default useStyles;
