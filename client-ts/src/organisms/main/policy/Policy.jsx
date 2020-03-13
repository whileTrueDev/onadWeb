import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TabBar from '../Introduction/components/TabBar';
import PolicyMarketer from './PolicyMarketer';
import PolicyCreator from './PolicyCreator';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 70,
  },
}));

const Policy = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleTabChange(evt, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <TabBar
        tabValue={value}
        handleTabChange={handleTabChange}
      />

      {value === 0 ? (
        // 마케터
        <PolicyMarketer />
      ) : (
        <PolicyCreator />
      )
      }


    </div>
  );
};

Policy.propTypes = {
  value: PropTypes.number,
};

Policy.defaultProps = {
  value: 0,
};

export default Policy;
