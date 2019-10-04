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
    marginBottom: theme.spacing(20),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function Manual(props) {
  // value of login validation
  const { userType, textSource } = props;

  const classes = useStyles();

  // Grow check value, set the grow check value
  const [growCheck, setGrowCheck] = React.useState(true);

  // Tab index value, set the value tab index
  const [value, setValue] = React.useState(userType);

  // handler for Tab changes
  function handleTabChange(evt, newValue) {
    setValue(newValue);
    setGrowCheck(true);
  }

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
            <div style={{ marginTop: 50 }} />

            <LeftCard
              growCheck={growCheck}
              triggerThreshold={200}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.firstSector}
            />
            <LeftCard
              growCheck={growCheck}
              triggerThreshold={600}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.secondSector}
            />
            <LeftCard
              growCheck={growCheck}
              triggerThreshold={1000}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.thirdSector}
            />
            <LeftCard
              growCheck={growCheck}
              triggerThreshold={1300}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.fourSector}
            />
            <LeftCard
              growCheck={growCheck}
              triggerThreshold={1600}
              growTime={1000}
              slideTime={700}
              source={textSource.marketer.fiveSector}
            />
          </React.Fragment>
        ) : (
          // 크리에이터
          <React.Fragment>
            <div style={{ marginTop: 50 }} />
            <RightCard
              growCheck={growCheck}
              triggerThreshold={200}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.firstSector}
            />
            <RightCard
              growCheck={growCheck}
              triggerThreshold={600}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.secondSector}
            />
            <RightCard
              growCheck={growCheck}
              triggerThreshold={1000}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.thirdSector}
            />
            <RightCard
              growCheck={growCheck}
              triggerThreshold={1300}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.fourSector}
            />
            <RightCard
              last
              growCheck={growCheck}
              triggerThreshold={1600}
              growTime={1000}
              slideTime={700}
              source={textSource.creator.fiveSector}
            />
          </React.Fragment>
        )}
      </Container>
    </section>
  );
}

Manual.propTypes = {
  userType: PropTypes.number,
  textSource: PropTypes.object.isRequired,
};

Manual.defaultProps = {
  userType: 1,
};

export default Manual;
