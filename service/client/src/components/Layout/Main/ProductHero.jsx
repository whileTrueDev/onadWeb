import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ProductHeroLayout from './ProductHeroLayout';

const backgroundImage = '/images/main_top.JPEG';

const styles = theme => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 150,

  },
  h5: {
    marginBottom: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing.unit * 10,
    },
  },
  more: {
    marginTop: theme.spacing.unit * 2,
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        광고 하고 싶으세요?
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        우리는 1인 방송인과 DA 광고를 관련성 분석을 통해 최적화 매칭합니다.
      </Typography>
      <Button
        color="default"
        variant="contained"
        size="large"
        className={classes.button}
        component={linkProps => (
          <Link {...linkProps} href="/" variant="button" />
        )}
      >
        시작하러가기
      </Button>
      <Typography variant="body2" color="inherit" className={classes.more}>
        쉽게 광고하세요
      </Typography>
    </ProductHeroLayout>
  );
}

export default withStyles(styles)(ProductHero);
