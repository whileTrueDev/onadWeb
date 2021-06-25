import { useState } from 'react';
import TabBar from '../Introduction/TabBar';
import PolicyMarketer from './PolicyMarketer';
import PolicyCreator from './PolicyCreator';
import useStyles from './style/Policy.style';

function Policy(): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  return (
    <div className={classes.root}>
      <TabBar tabValue={value} handleTabChange={setValue} />

      {value === 0 ? (
        // 마케터
        <PolicyMarketer />
      ) : (
        <PolicyCreator />
      )}
    </div>
  );
}

export default Policy;
