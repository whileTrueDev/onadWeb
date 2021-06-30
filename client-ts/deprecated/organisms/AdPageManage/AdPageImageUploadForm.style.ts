import { makeStyles, Theme } from '@material-ui/core/styles';

const useAdPageImageUploadFormStyles = makeStyles((theme: Theme) => ({
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: 550,
    '&:hover': {
      zIndex: 1,
    },
    '&:hover $imageButton': {
      opacity: 1,
    },
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  imageButton: {
    transition: theme.transitions.create('opacity'),
    opacity: 0,
    margin: 0,
    padding: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
      width: 235,
    },
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(2),
    },
  },
}));

export default useAdPageImageUploadFormStyles;
