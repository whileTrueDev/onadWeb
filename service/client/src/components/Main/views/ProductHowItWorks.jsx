import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import grey from '@material-ui/core/colors/grey';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grow from '@material-ui/core/Grow';
import Button from '../components/Button';
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

function ProductHowItWorks(props) {
  const [value, setValue] = React.useState(0);
  // const [checked, setChecked] = React.useState(false);

  // tab에 따라 다른 howitworks를 보여준다
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { classes } = props;

  //   this.handleScroll = this.handleScroll.bind(this);
  // }

  // componentDidMount() {
  //   window.addEventListener('scroll', this.handleScroll);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll);
  // }

  // handleScroll(e) {
  //   this.setState({
  //     checked: true,
  //   });
  // }

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="마케터 또는 광고주" />
          <Tab label="크리에이터 또는 1인미디어 방송" />
        </Tabs>
        {
          value === 0 && (
            <Grow>
              <ProductHowItWorksMaketerItem
                classes={classes}
              />
            </Grow>
          )
        }
        {
          value === 1 && (
            <ProductHowItWorksCreatorItem
              classes={classes}
            />
          )
        }

        <Button
          color="secondary"
          size="large"
          variant="contained"
          className={classes.button}
          component="a"
          href="/dashboard"
        >
            시작하기
        </Button>
      </Container>
    </section>
  );
}

ProductHowItWorks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHowItWorks);
