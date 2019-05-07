import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Grow from '@material-ui/core/Grow';
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
  root: {

  },
  h2: {
    width: '330px',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
      width: 1024,
    },
  },
  h5: {
    width: '300px',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      width: '500px',
      marginTop: theme.spacing(10),
    },
  },
  h6: {
    marginTop: theme.spacing(2),
    color: grey[500],
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

function ProductHero(props) {
  const { classes } = props;
  const [check] = React.useState(true);

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="" />
      <Grow
        in={check}
        {...(check ? { timeout: 2500 } : {})}
      >
        <Typography
          color="inherit"
          align="center"
          variant="h2"
          className={classes.h2}
        >
        효율적으로 광고하세요
        </Typography>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 2500 } : {})}
      >
        <Typography
          color="inherit"
          align="center"
          variant="h2"
          marked="center"
          style={{ marginTop: 15 }}
        >
        쉽게 광고를 유치하세요
        </Typography>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 2500 } : {})}
      >
        <Typography
          color="inherit"
          align="center"
          variant="h5"
          className={classes.h5}
        >
        관련성 분석 통해 크리에이터와 광고주를 1:N 또는 N:N 매칭합니다
          <Typography
            className={classes.h6}
            variant="body2"
          >
          설치 없이 모든 일을 웹에서 간단히 할 수 있습니다.
          </Typography>
        </Typography>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 2500 } : {})}
      >
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
      </Grow>


    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object,
};

ProductHero.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ProductHero);
