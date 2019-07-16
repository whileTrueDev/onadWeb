import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Grow from '@material-ui/core/Grow';
import axios from '../../../../utils/axios';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import HOST from '../../../../config';

const styles = makeStyles(theme => ({
  background: {
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    marginTop: 50,
  },
  h3: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(8),
      width: 1024,
    },
    [theme.breakpoints.down('sm')]: {
      width: '330px',
      fontSize: 37,
    },
  },
  h3sub: {
    [theme.breakpoints.down('sm')]: {
      width: '330px',
      fontSize: 37,
    },
  },
  h5: {
    width: '300px',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      width: '500px',
      marginTop: theme.spacing(5),
    },
  },
  h6: {
    marginTop: theme.spacing(2),
    color: grey[500],
  },
  more: {
    marginTop: theme.spacing(2),
  },
}));

function ProductHero(props) {
  const { text, backgroundImage, history } = props;

  const classes = styles();

  const [check] = React.useState(true);

  const handleClick = () => {
    axios.get(`${HOST}/api/dashboard/checkUserType`)
      .then((res) => {
        const { userType } = res.data;
        if (userType === undefined) {
          // 로그인 이후 이용하세요
          alert('로그인 이후 이용하세요!');
        } else if (userType === 'marketer') {
          history.push('/dashboard/marketer/main');
        } else if (userType === 'creator') {
          history.push('/dashboard/creator/main');
        }
      }).catch((err) => {
        console.log(err);
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
          variant="h3"
          className={classes.h3}
        >
          {text.title}
        </Typography>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 2500 } : {})}
      >
        <Typography
          className={classes.h3sub}
          color="inherit"
          align="center"
          variant="h3"
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
          variant="subtitle2"
          className={classes.h5}
        >
          {text.body}
        </Typography>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 2500 } : {})}
      >
        <Button
          color="primary"
          variant="contained"
          size="large"
          className={classes.button}
          onClick={handleClick}
        >
          대시보드로 이동
        </Button>
      </Grow>

      {text.tail && (
      <Typography
        className={classes.h6}
        variant="subtitle2"
      >
        {text.tail}
      </Typography>
      )}
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
    body: '모든 광고유치, 광고계약 등 모든 과정은 웹에서 손쉽게 사용하실 수 있습니다.',
    tail: '',
  },
};

export default ProductHero;
