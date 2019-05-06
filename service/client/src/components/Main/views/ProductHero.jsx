import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';

const backgroundImage = 'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
    marginTop: 50,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        마음껏, 효율적으로 광고하세요.
        <Typography color="inherit" align="center" variant="h2" style={{ marginTop: 15 }}>
        쉽게 광고를 유치하세요.
        </Typography>
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        className={classes.h5}
        style={{ width: '450px' }}
      >
        우리는 관련성 분석 통해 크리에이터와 광고주를 1:N 또는 N:N 매칭합니다.
        <Typography style={{
          marginTop: '10px',
        }}
        >
        설치 없이 웹에서 모든 일을 간단히 할 수 있습니다.
        </Typography>
      </Typography>

      <Button
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button}
        component="a"
        href="/"
      >
        대시보드로 이동
      </Button>
      <Typography variant="body2" color="inherit" className={classes.more} />
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.shape(PropTypes.object),
};

export default withStyles(styles)(ProductHero);
