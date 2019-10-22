import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useScrollTrigger } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  imageWrapper: {
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '280px',
    [theme.breakpoints.down('xs')]: {
      width: '100% !important',
      height: 200,
    },
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
});

const ProductCategoriesDetail = (props) => {
  const { classes, image } = props;

  const [trigger, setTrigger] = React.useState(
    useScrollTrigger(
      { threshold: image.trigger.threshold, disableHysteresis: true },
    ),
  );
  React.useEffect(() => {
    function scrollTrigger() {
      if (window.scrollY > image.trigger.threshold) {
        setTrigger(true);
      }
    }
    scrollTrigger();
  });

  return (
    <React.Fragment>
      <Grow
        in={trigger}
        timeout={{ enter: image.trigger.timeout }}
      >
        <ButtonBase
          className={classes.imageWrapper}
          style={{ width: image.width }}
          disabled
        >
          <div
            className={classes.imageSrc}
            style={{ backgroundImage: `url(${image.url})` }}
          />
        </ButtonBase>
      </Grow>
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
