import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import ProductCategoriesDetail from './ProductCategoriesDetail';
import sources from '../../source/sources';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(16),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(13),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(10),
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(7),
    },
  },
  mainMiddle: {
    display: 'flex',
    marginBottom: theme.spacing(4),
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
    },
  },
  Middletitle: {
    fontSize: 48,
    [theme.breakpoints.down('md')]: {
      fontSize: 40,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      textAlign: 'center',
      wordBreak: 'keep-all'
    },
  },
  MiddleContent: {
    fontSize: 40,
    [theme.breakpoints.down('md')]: {
      fontSize: 32,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
      wordBreak: 'keep-all'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
      wordBreak: 'keep-all',
      textAlign: 'center',
    },
  },
  titleLeft: {
    width: '40px',
    height: '60px',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: '32px',
      height: '48px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '24px',
      height: '36px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '18px',
      height: '27px',
    },
  },
  titleRight: {
    width: '40px',
    height: '60px',
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: '32px',
      height: '48px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '24px',
      height: '36px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '18px',
      height: '27px',
    },
  },
});

class ProductCategories extends Component {
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

  componentDidUpdate() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (!this.checked) {
      this.setState({
        checked: true,
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { checked } = this.state;

    return (
      <Container
        maxWidth="lg"
        className={classes.root}
        component="section"
      >
        <div className={classes.mainMiddle}>
          <img src="/pngs/main/mainBenefitTitleLeft.png" alt="middleTitleLeft" className={classes.titleLeft} />
          <Typography component="h2" className={classes.Middletitle}>
            지금 당장 온애드를 사용해보세요
          </Typography>
          <img src="/pngs/main/mainBenefitTitleRight.png" alt="middleTitleRight" className={classes.titleRight} />
        </div>

        <Typography component="h2" style={{ fontFamily: 'Noto Sans KR' }} className={classes.MiddleContent}>
          간단한 약관만 수락해주시면 바로 해보실 수 있습니다
        </Typography>


        <ProductCategoriesDetail
          checked={checked}
          images={sources.categories}
        />

        <Button
          component={Link}
          to="/introduction"
          style={{ float: 'right' }}
        >
          <Typography
            variant="h5"
            component="h2"
            style={{ color: '#00DBE0', fontWeight: 'bold', fontFamily: 'Noto Sans KR', }}
          >
              + 자세히 알아보기
          </Typography>
        </Button>
        <div style={{ clear: 'both' }} />

      </Container>
    );
  }
}


ProductCategories.propTypes = {
  classes: PropTypes.object,
};

ProductCategories.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ProductCategories);
