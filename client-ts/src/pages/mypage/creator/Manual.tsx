import React, { useState } from 'react';
// core ../../../atoms
// material-ui
import Grow from '@material-ui/core/Grow';// custom container
import GridItem from '../../../atoms/Grid/GridItem';
import GridContainer from '../../../atoms/Grid/GridContainer';

import ManualSelect from '../../../organisms/mypage/shared/ManualSelector';
import CreatorManualDetail from '../../../organisms/mypage/creator/Manual/CreatorManualDetail';
import sources from '../../../organisms/mypage/creator/Manual/sources';
import CreatorManualSelect from '../../../organisms/mypage/creator/Manual/CreatorManualSelect';

function CreatorManual(): JSX.Element {
  const [manual, setManual] = useState<number | null>(null);

  const handleButton = (num: number): void => {
    setManual(num);
  };

  if (false) {
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
              if (manual === 1) return (<CreatorManualDetail source={sources.contract} />);
              if (manual === 2) return (<CreatorManualDetail source={sources.programSetting} />);
              if (manual === 3) return (<CreatorManualDetail source={sources.income} />);
              if (manual === 4) return (<CreatorManualDetail source={sources.landing} />);
              if (manual === 5) return (<CreatorManualDetail source={sources.adpage} />);
              if (manual === 6) return (<CreatorManualDetail source={sources.bannerlist} />);
              if (manual === 7) return (<CreatorManualDetail source={sources.withdrawal} />);
              return null;
            })()}
          </GridItem>
        </Grow>
      </GridContainer>
    );
  }


  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        <GridItem xs={12}>
          <CreatorManualSelect />
        </GridItem>
      </GridContainer>
    </div>
  );
}
export default CreatorManual;
