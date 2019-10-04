import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '../../components/Typography';

import ProductCategoriesDetail from './ProductCategoriesDetail';
import sources from '../../source/sources';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(4),
  },
});

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
        maxWidth="lg"
        className={classes.root}
        component="section"
      >
        <Typography variant="h4" marked="center" align="center" component="h2">
        손쉽게 이용할 수 있습니다.
        </Typography>
        <ProductCategoriesDetail
          checked={checked}
          images={sources.categories}
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
