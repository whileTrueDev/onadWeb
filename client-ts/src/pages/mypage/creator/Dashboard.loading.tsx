import React from 'react';
import Skeleton, { SkeletonProps } from '@material-ui/lab/Skeleton';
import Hidden from '@material-ui/core/Hidden';
import GridContainer from '../../../atoms/Grid/GridContainer';
import GridItem from '../../../atoms/Grid/GridItem';

const CustomSkeleton = (
  props: SkeletonProps
): JSX.Element => <Skeleton style={{ padding: 20 }} {...props} />;

export default function DashboardLoading(): JSX.Element {
  return (
    <GridContainer direction="row" spacing={4}>

      {/* 배너 권장 크기 및 무효화 공지 */}
      <Hidden smDown>
        <GridItem sm={12} xl={9}>
          <CustomSkeleton height={100} variant="text" />

        </GridItem>
      </Hidden>

      <Hidden lgDown>
        <GridItem xl={3} />
      </Hidden>

      <GridItem xs={12} xl={3}>
        <GridContainer>

          {/* 수익금 카드 */}
          <GridItem xs={12} md={6} xl={12}>
            <CustomSkeleton height={250} variant="text" />
          </GridItem>

          {/* 광고페이지 카드 */}
          <GridItem xs={12} md={6} xl={12}>
            <CustomSkeleton height={250} variant="text" />

          </GridItem>
        </GridContainer>
      </GridItem>

      {/* 수익금 차트 */}
      <GridItem xs={12} xl={6}>
        <CustomSkeleton height={500} variant="rect" />
      </GridItem>

      {/* 현재 송출중 배너 카드 */}
      <GridItem xs={12} sm={6} lg={4}>
        <CustomSkeleton height={300} variant="rect" />
      </GridItem>

      {/* 배너 광고 송출 URL */}
      <GridItem xs={12} sm={6} lg={4}>
        <CustomSkeleton height={300} variant="rect" />
      </GridItem>

      <GridItem xs={12} sm={1} xl={2} />
    </GridContainer>
  );
}
