import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import grey from '@material-ui/core/colors/grey';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Subscriptions, Person } from '@material-ui/icons';
import ProductHowItWorksMaketerItem from './ProductHowItWorksMaketerItem';
import ProductHowItWorksCreatorItem from './ProductHowItWorksCreatorItem';

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: grey[300],
    overflow: 'hidden',
  },
  container: {
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  title: {
    marginBottom: theme.spacing(14),
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(8),
  },
  tabs: {
    flexGrow: 1,
    marginBottom: theme.spacing(5),
  },
});

class ProductHowItWorks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      check: false,
    });
  }

  componentDidMount() {
    this.setState({
      check: true,
    });
  }

  handleChange(event, newValue) {
    this.setState({
      check: true,
      value: newValue,
    });
  }

  render() {
    const { classes } = this.props;
    const { value, check } = this.state;

    return (
      <section className={classes.root}>
        <Container className={classes.container}>
          <Tabs
            className={classes.tabs}
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              icon={<Person />}
              label="마케터 또는 광고주"
            />
            <Tab
              icon={<Subscriptions />}
              label="크리에이터 또는 1인미디어 방송인"
            />
          </Tabs>
          {
            value === 0 ? (
              <ProductHowItWorksMaketerItem
                classes={classes}
                check={check}
              />
            ) : (
              <ProductHowItWorksCreatorItem
                classes={classes}
                check={check}
              />
            )
          }
        </Container>
      </section>
    );
  }
}


ProductHowItWorks.propTypes = {
  classes: PropTypes.object,
};

ProductHowItWorks.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ProductHowItWorks);
