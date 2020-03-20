import { makeStyles } from '@material-ui/core/styles';

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
