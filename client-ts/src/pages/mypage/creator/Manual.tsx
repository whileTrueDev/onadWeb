import React, { useState } from 'react';
// core ../../../atoms
// material-ui
import Grow from '@material-ui/core/Grow';// custom container
import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';

import ManualSelect from '../../../organisms/mypage/creator/Manual/Select';
import ManualDetail from '../../../organisms/mypage/creator/Manual/ManualDetail';
import sources from '../../../organisms/mypage/creator/Manual/sources';

function CreatorManual(): JSX.Element {
  const [manual, setManual] = useState<number | null>(null);

  const handleButton = (num: number): void => {
    setManual(num);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6} lg={4} xl={3}>
        <ManualSelect
          handleButton={handleButton}
          activeStep={manual}
          sources={sources.selectComponent}
        />
      </GridItem>

      {/* { Boolean(selectedSource) && ( */}

      <Grow in={Boolean(manual)}>
        <GridItem xs={12} sm={12} md={6} lg={8} xl={6}>
          {((): React.ReactNode | null => {
            if (manual === 1) return (<ManualDetail source={sources.contract} />);
            if (manual === 2) return (<ManualDetail source={sources.programSetting} />);
            if (manual === 3) return (<ManualDetail source={sources.income} />);
            if (manual === 4) return (<ManualDetail source={sources.landing} />);
            if (manual === 5) return (<ManualDetail source={sources.bannerlist} />);
            if (manual === 6) return (<ManualDetail source={sources.withdrawal} />);
            return null;
          })()}
        </GridItem>
      </Grow>
    </GridContainer>
  );
}
export default CreatorManual;
