import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '../../components/Typography';

const styles = theme => ({
  imageWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    padding: 0,
    borderRadius: 0,
    height: 230,
    [theme.breakpoints.down('md')]: {
      height: '210px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '200px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100% !important',
      height: 150,
    },
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    color: '#000',
    overflow: 'auto',
    fontFamily: 'Noto Sans KR',
  },
  imageSrc: {
    width: '90px',
    height: '90px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    [theme.breakpoints.down('md')]: {
      width: '90px',
      height: '90px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      height: '80px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '80px',
      height: '80px'
    },
  },
  imageTitle: {
    position: 'relative',
    width: '80%',
    marginLeft: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    alignItems: 'top',
    fontFamily: 'Noto Sans KR',
    fontSize: 22,
    [theme.breakpoints.down('md')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 17
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
      wordBreak: 'keep-all'
    },
  },
  imageSubTitle: {
    position: 'relative',
    fontSize: '18px',
    fontWeight: 'normal',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      fontSize: 17
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 15
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
      wordBreak: 'keep-all'
    },
  },
});

const ProductCategoriesDetail = (props) => {
  const {
    classes, image
  } = props;

  return (
    <React.Fragment>
      <ButtonBase
        disabled
        key={image.title}
        className={classes.imageWrapper}
        style={{
          width: image.width,
          height: image.height,
        }}
      >
        <div className={classes.imageButton}>
          <img src={image.url} className={classes.imageSrc} alt={image.title} />
          <Typography
            color="inherit"
            className={classes.imageTitle}
          >
            {image.title}
            <br />
            <br />

            <div className={classes.imageSubTitle}>
              {image.fullDescription.split('\n').map(row => (
                <p key={row} style={{ marginTop: 1, marginBottom: 1 }}>{`${row}`}</p>
              ))}
            </div>
          </Typography>
        </div>

      </ButtonBase>
    </React.Fragment>
  );
};


ProductCategoriesDetail.propTypes = {
  classes: PropTypes.object,
  image: PropTypes.object.isRequired,
};

ProductCategoriesDetail.defaultProps = {
  classes: {},
};
export default withStyles(styles)(ProductCategoriesDetail);
