import { makeStyles } from '@material-ui/core/styles';

const useCardBodyStyles = makeStyles({
  cardBody: {
    padding: '0.9375rem 20px',
    flex: '1 1 auto',
    position: 'relative',
  },
  cardBodyPlain: {
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  cardBodyProfile: {
    marginTop: '15px',
  }
});

export default useCardBodyStyles;
