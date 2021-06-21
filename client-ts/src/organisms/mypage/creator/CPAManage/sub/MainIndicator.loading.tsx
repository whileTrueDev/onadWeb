import React from 'react';
import Skeleton, { SkeletonProps } from '@material-ui/lab/Skeleton';
import Hidden from '@material-ui/core/Hidden';
import GridContainer from '../../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../../atoms/Grid/GridItem';

const CustomSkeleton = (props: SkeletonProps): JSX.Element => <Skeleton {...props} />;

export default function MainIndicatorLoading(): JSX.Element {
  return (
    <GridContainer direction="row">
      <Hidden smDown>
        <GridItem md={12} sm={12} xl={12}>
          <CustomSkeleton height={200} variant="rect" />
        </GridItem>
      </Hidden>
    </GridContainer>
  );
}
