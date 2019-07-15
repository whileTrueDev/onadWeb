import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '../../components/Typography';
import ProductCategoriesDetail from './ProductCategoriesDetail';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(4),
  },
});

// 이미지 데이터
const images = [
  {
    url:
    '/pngs/productCategory1.gif',
    title: '1인 미디어. 크리에이터.',
    description: 'OBS 또는 Xsplit 을 사용하신다면 곧바로 광고를 유치할 수 있습니다.',
    fullDescription: '우리는 1인 미디어 크리에이터들을 사랑합니다. OBS, Xsplit 등의 방송 송출프로그램을 사용하신다면 바로 광고를 유치할 수 있습니다. 간단하고도 쉽게 광고수익을 얻으세요',
    width: '35%',
  },
  {
    url:
    '/pngs/productCategory2.gif',
    title: 'DA광고를 누구나',
    description: '광고를 원하는 누구나 광고 집행이 가능합니다.',
    fullDescription: '광고를 원하는 누구나 광고 집행이 가능합니다. 광고 집행 시간에 따라 정확하고, 합리적인 금액으로 광고할 수 있습니다.',
    width: '33%',
  },
  {
    url:
    '/pngs/productCategory3.gif',
    title: '간단하게, 효율적으로',
    description: 'description',
    fullDescription: 'fullDescription',
    width: '32%',
  },
  {
    url:
    '/pngs/productCategory4.gif',
    title: 'some Image',
    description: 'description',
    fullDescription: 'fullDescription',
    width: '60%',
  },
  {
    url:
    '/pngs/productCategory5.gif',
    title: '오픈베타가 예정되어있습니다',
    description: '2019.10.',
    fullDescription: 'fullDescription',
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
        className={classes.root}
        component="section"
      >
        <Typography variant="h4" marked="center" align="center" component="h2">
        손쉽게 이용할 수 있습니다.
        </Typography>

        <ProductCategoriesDetail
          checked={checked}
          images={images}
        />

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
