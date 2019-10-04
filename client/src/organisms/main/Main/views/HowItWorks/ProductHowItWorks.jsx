import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import grey from '@material-ui/core/colors/grey';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { Subscriptions, Person } from '@material-ui/icons';
import HowItWorksDetailMarketer from './HowItWorksDetailMarketer';
import HowItWorksDetailCreator from './HowItWorksDetailCreator';
import sources from '../../source/sources';
import history from '../../../../../history';

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: grey[100],
    overflow: 'hidden',
  },
  container: {
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabs: {
    flexGrow: 1,
    marginBottom: theme.spacing(5),
    boxShadow: 'none',
    backgroundColor: grey[100],
    zIndex: 0,
  },
  tab: {
    height: 85,
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


  componentDidMount() {
    this.setState({
      check: true,
    });
  }

  UNSAFE_componentWillMount() {
    this.setState({
      check: false,
    });
  }

  handleChange(event, newValue) {
    this.setState({
      check: true,
      value: newValue,
    });
  }

  render() {
    const { classes, isLogin } = this.props;
    const { value, check } = this.state;

    return (
      <section className={classes.root}>

        <Container className={classes.container}>
          <AppBar className={classes.tabs} position="static">
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                className={classes.tab}
                icon={<Person />}
                label="마케터"
              />
              <Tab
                className={classes.tab}
                icon={<Subscriptions />}
                label="크리에이터"
              />
            </Tabs>
          </AppBar>
          { value === 0 ? (
            <HowItWorksDetailMarketer
              check={check}
              source={sources.howitworks.marketer}
              isLogin={isLogin}
              history={history}
            />
          ) : (
            <HowItWorksDetailCreator
              check={check}
              source={sources.howitworks.creator}
              isLogin={isLogin}
              history={history}
            />
          )}
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
