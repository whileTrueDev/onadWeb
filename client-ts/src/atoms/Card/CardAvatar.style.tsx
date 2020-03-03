import { Theme, makeStyles } from '@material-ui/core/styles';

const useCardAvaterStyles = makeStyles((theme: Theme) => ({
  cardAvatar: {
    '&$cardAvatarProfile img': {
      width: '100%',
      height: 'auto',
    },
  },
  cardAvatarProfile: {
    maxWidth: '130px',
    maxHeight: '130px',
    margin: '-50px auto 0',
    borderRadius: '50%',
    overflow: 'hidden',
    padding: '0',
    boxShadow: theme.shadows[4],
    '&$cardAvatarPlain': {
      marginTop: '0',
    },
  },
  cardAvatarPlain: {},
}));

export default useCardAvaterStyles;
