import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';

export default function MyOfficeLoading(): JSX.Element {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Skeleton height={300} />
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} lg={6}>
          <Skeleton height={300} />
        </GridItem>
        <GridItem xs={12} lg={6}>
          <Skeleton height={300} />
        </GridItem>
      </GridContainer>
    </div>
  );
}
