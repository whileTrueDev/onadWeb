import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    fontWeight: 600
  },
  button: {
    fontWeight: 800,
    width: '100%',
    fontFamily: 'Noto Sans KR',
  },
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    objectPosition: 'top',
    borderRadius: '50%'
  },
  imageSrc: {
    display: 'flex',
    backgroundSize: 'cover',
    backgroundPosition: 'inherit',
    width: '150px',
    height: '120px',
    maxWidth: '160px',
    maxHeight: '130px',
    margin: '0 auto',
  },
}));

export default useStyles;
