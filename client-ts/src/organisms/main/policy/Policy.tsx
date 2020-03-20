import React from 'react';
import TabBar from '../Introduction/TabBar';
import PolicyMarketer from './PolicyMarketer';
import PolicyCreator from './PolicyCreator';
import useStyles from './style/Policy.style';

function Policy(): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number): void {
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
      )
        : (
          <PolicyCreator />
        )}


    </div>
  );
}

export default Policy;
