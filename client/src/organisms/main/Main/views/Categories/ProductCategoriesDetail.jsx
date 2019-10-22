import React from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ProductCategoriesImageButton from './ProductCategoriesImageButton';


const styles = theme => ({
  images: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
    boxShadow: 'none',
  },
});

const ProductCategoriesDetail = (props) => {
  const { classes, images } = props;

  // 작아지면(phone 환경) false, 커지면 true
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <div className={classes.images}>
      {images.map(image => (
        <ProductCategoriesImageButton
          key={shortid.generate()}
          image={image}
          matches={matches}
        />
      ))}
    </div>
  );
};


ProductCategoriesDetail.propTypes = {
  classes: PropTypes.object,
  images: PropTypes.array.isRequired,
};

ProductCategoriesDetail.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ProductCategoriesDetail);
