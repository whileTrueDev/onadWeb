import React, { useState } from 'react';
// material-ui
import Grow from '@material-ui/core/Grow';
// core ../../../atoms
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';

import ManualSelector from '../../../organisms/mypage/shared/ManualSelector';
import MarketerManualDetail from '../../../organisms/mypage/marketer/Manual/MarketerManualDetail';
import sources from '../../../organisms/mypage/marketer/Manual/sources';

const MarketerManual = (): JSX.Element => {
  const [manual, setManual] = useState<number | null>(null);

  const handleButton = (num: number): void => {
    setManual(num);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6} lg={4} xl={3}>
        <ManualSelector
          handleButton={handleButton}
          activeStep={manual}
          sources={sources.selectComponent}
        />
      </GridItem>

      {/* { Boolean(selectedSource) && ( */}
      <Grow in={Boolean(manual)}>
        <GridItem xs={12} sm={12} md={6} lg={8} xl={6}>
          {((): React.ReactNode | null => {
            if (manual === 1) { return (<MarketerManualDetail source={sources.bannerRegist} />); }
            if (manual === 2) { return (<MarketerManualDetail source={sources.bannerUpload} />); }
            if (manual === 3) { return (<MarketerManualDetail source={sources.campaignStart} />); }
            if (manual === 4) { return (<MarketerManualDetail source={sources.seeChart} />); }
            if (manual === 5) { return (<MarketerManualDetail source={sources.cash} />); }
            if (manual === 6) { return (<MarketerManualDetail source={sources.business} />); }
            return null;
          })()}
        </GridItem>
      </Grow>
    </GridContainer>
  );
};

export default MarketerManual;
