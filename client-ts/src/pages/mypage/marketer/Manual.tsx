import React from 'react';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';
import ManualContents from '../../../organisms/mypage/shared/ManualContents';
import { useGetRequest } from '../../../utils/hooks';

const MarketerManual = (): JSX.Element => {
  const manualGet = useGetRequest('/manual', { type: 'marketer' });

  return (
    <div style={{ margin: '0 auto', maxWidth: 1430 }}>
      <GridContainer>
        <GridItem xs={12}>
          <ManualContents manualGet={manualGet} />
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default MarketerManual;
