import React from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
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
  const { classes, images } = props;

  // 작아지면(phone 환경) false, 커지면 true
  const matches = useMediaQuery('(min-width:600px)');

  // Value for image comming slide animation
  const triggerThreshold = 200; // trigger for scrollTop
  const slideTime = 1000; // slide animation tile
  const [trigger, setTrigger] = React.useState(
    useScrollTrigger(
      { threshold: triggerThreshold, disableHysteresis: true },
    ),
  );

  React.useEffect(() => {
    function scrollTrigger() {
      if (window.scrollY > triggerThreshold) {
        setTrigger(true);
      }
    }
    scrollTrigger();
  });

  return (
    <Slide
      in={trigger}
      direction="right"
      timeout={{ enter: slideTime }}
      // mountOnEnter
    >
      <div className={classes.images}>

        {images.map(image => (
          <ProductCategoriesImageButton
            key={shortid.generate()}
            image={image}
            matches={matches}
          />
        ))}
      </div>

    </Slide>
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
