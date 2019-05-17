import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import RightCard from './components/RightCard';
import LeftCard from './components/LeftCard';
import TabBar from './components/TabBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  container: {
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function Manual(props) {
  const classes = useStyles();

  // Grow check value, set the grow check value
  const [growCheck, setGrowCheck] = React.useState(true);

  // Tab index value, set the value tab index
  const [value, setValue] = React.useState(0);

  // handler for Tab changes
  function handleTabChange(evt, newValue) {
    setValue(newValue);
    setGrowCheck(true);
  }

  // value of login validation
  const { isLogin, textSource } = props;
  React.useEffect(() => {
    if (isLogin) {
      setValue(isLogin.userType);
    }
  }, [isLogin]);

  return (
    <section className={classes.root}>
      <Container className={classes.container}>

        <TabBar
          tabValue={value}
          handleTabChange={handleTabChange}
        />

        {value === 0 ? (
          // 마케터
          <React.Fragment>
            <LeftCard
              growCheck={growCheck}
              triggerThreshold={300}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.firstSector}
            />
            <LeftCard
              growCheck={growCheck}
              triggerThreshold={800}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.secondSector}
            />
            <LeftCard
              growCheck={growCheck}
              triggerThreshold={1300}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.thirdSector}
            />
          </React.Fragment>
        ) : (
          // 크리에이터
          <React.Fragment>
            <RightCard
              growCheck={growCheck}
              triggerThreshold={300}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.firstSector}
            />
            <RightCard
              growCheck={growCheck}
              triggerThreshold={800}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.secondSector}
            />
            <RightCard
              growCheck={growCheck}
              triggerThreshold={1300}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.thirdSector}
            />
          </React.Fragment>
        )}
      </Container>
    </section>
  );
}

Manual.propTypes = {
  isLogin: PropTypes.object,
  textSource: PropTypes.object.isRequired,
};

Manual.defaultProps = {
  isLogin: { userType: 0 },
};

export default Manual;
