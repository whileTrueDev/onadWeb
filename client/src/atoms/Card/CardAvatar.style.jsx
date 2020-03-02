const cardAvatarStyle = (theme) => ({
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
});

export default cardAvatarStyle;
