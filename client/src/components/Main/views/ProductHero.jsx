import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Grow from '@material-ui/core/Grow';
import axios from 'axios';
import { CodeSharp } from '@material-ui/icons';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';

const styles = theme => ({
  background: {
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
  const {
    classes, text, backgroundImage, history,
  } = props;

  const [check] = React.useState(true);

  const handleClick = () => {
    axios.get('/dashboard/checkUserType')
      .then((res) => {
        if (res.data.userType === 'marketer') {
          history.push('/dashboard/marketer/main');
        } else {
          history.push('/dashboard/creator/main');
        }
      }).catch((err) => {

      });
  };

  return (
    <ProductHeroLayout
      backgroundClassName={classes.background}
      backgroundImage={backgroundImage}
    >
      {/* Increase the network loading priority of the background image. */}
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
          {text.title}
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
          {text.subTitle}
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
          {text.body}
          <Typography
            className={classes.h6}
            variant="body2"
          >
            {text.tail}
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
          // component="a"
          // href="/dashboard/main"
          onClick={handleClick}
        >
        대시보드로 이동
        </Button>
      </Grow>


    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object,
  text: PropTypes.object,
  backgroundImage: PropTypes.string,
};

ProductHero.defaultProps = {
  classes: {},
  backgroundImage: '',
  text: {
    title: '효율적으로 광고하세요',
    subTitle: '쉽게 광고를 유치하세요',
    body: '관련성 분석 통해 크리에이터와 광고주를 1:N 또는 N:N 매칭합니다',
    tail: '설치 없이 모든 일을 웹에서 간단히 할 수 있습니다.',
  },
};

export default withStyles(styles)(ProductHero);
