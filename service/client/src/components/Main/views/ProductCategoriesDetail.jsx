import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ProductCategoriesImageButton from './ProductCategoriesImageButton';


const styles = theme => ({
  images: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
    boxShadow: '5px 5px 5px 5px grey',
  },
});

const ProductCategoriesDetail = (props) => {
  const { classes, checked, images } = props;
  // 작아지면(phone 환경) false, 커지면 true
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <Grow
      in={checked}
      {...(checked ? { timeout: 2000 } : {})}
    >
      <div className={classes.images}>

        {images.map(image => (
          <Grow
            key={image.title}
            in={checked}
            {...(checked ? { timeout: 2000 } : {})}
          >
            <ProductCategoriesImageButton
              image={image}
              matches={matches}
            />
          </Grow>
        ))}
      </div>
    </Grow>
  );
};


ProductCategoriesDetail.propTypes = {
  classes: PropTypes.object,
  checked: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
};

ProductCategoriesDetail.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ProductCategoriesDetail);
