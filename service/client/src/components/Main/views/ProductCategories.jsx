import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import Typography from '../components/Typography';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(4),
  },
  images: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
    boxShadow: '5px 5px 5px 5px grey',
  },
  imageWrapper: {
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '40vh',
    transitionDelay: '2s',
    [theme.breakpoints.down('sm')]: {
      width: '100% !important',
      height: 100,
    },
    '&:hover': {
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      opacity: 0.15,
    },
    '&:hover $imageMarked': {
      opacity: 0,
    },
    '&:hover $imageTitle': {
      borderBottom: '3px solid',
    },
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.palette.common.black,
    opacity: 0.5,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    marginLeft: 13,
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 14px`,
  },
  imageSubTitle: {
    position: 'relative',
    marginRight: 20,
  },
  imageMarked: {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
});

const images = [
  {
    url:
      '/images/productCategory1.gif',
    title: '1인 미디어. 크리에이터.',
    description: '우리는 1인 미디어 크리에이터들을 사랑합니다. OBS, Xsplit 등의 방송 송출프로그램을 사용하신다면 바로 광고를 유치할 수 있습니다. 간단하고도 쉽게 광고수익을 얻으세요',
    width: '35%',
  },
  {
    url:
      '/images/productCategory2.gif',
    title: 'DA광고를 누구나, ',
    description: '광고를 원하는 누구나 광고 집행이 가능합니다. 광고 집행 시간에 따라 정확하고, 합리적인 금액으로 광고할 수 있습니다.',
    width: '33%',
  },
  {
    url:
    '/images/productCategory3.gif',
    title: '간단하게, 효율적으로',
    description: 'description',
    width: '32%',
  },
  {
    url:
    '/images/productCategory4.gif',
    title: 'some Image',
    description: 'description',
    width: '60%',
  },
  {
    url:
    '/images/productCategory5.gif',
    title: '오픈베타가 예정되어있습니다',
    description: '2019.10.',
    width: '40%',
  },
];
class ProductCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(e) {
    this.setState({
      checked: true,
    });
  }

  render() {
    const { classes } = this.props;
    const { checked } = this.state;
    return (
      <Container
        className={classes.root}
        component="section"
      >
        <Typography variant="h4" marked="center" align="center" component="h2">
        손쉽게 이용할 수 있습니다.
        </Typography>
        <Grow
          in={checked}
          {...(checked ? { timeout: 1500 } : {})}
        >
          <div className={classes.images}>

            {images.map(image => (
              <Grow
                in={checked}
                {...(checked ? { timeout: 1500 } : {})}
              >
                <ButtonBase
                  key={image.title}
                  className={classes.imageWrapper}
                  style={{
                    width: image.width,
                  }}
                >
                  <div
                    className={classes.imageSrc}
                    style={{
                      backgroundImage: `url(${image.url})`,
                    }}
                  />
                  <div className={classes.imageBackdrop} />
                  <div className={classes.imageButton}>
                    <Typography
                      variant="h5"
                      color="inherit"
                      className={classes.imageTitle}
                    >
                      {image.title}
                      <div className={classes.imageMarked} />
                    </Typography>
                    <Grid container>
                      <Typography
                        variant="subtitle"
                        className={classes.imageSubTitle}
                      >
                        {image.description}
                      </Typography>
                    </Grid>

                  </div>
                </ButtonBase>
              </Grow>
            ))}
          </div>
        </Grow>
      </Container>
    );
  }
}


ProductCategories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCategories);
