import Skeleton from '@material-ui/lab/Skeleton';

import GridContainer from '../../src/atoms/Grid/GridContainer';
import GridItem from '../../src/atoms/Grid/GridItem';

export default function CPACampaignsLoading(): JSX.Element {
  return (
    <GridContainer>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(x => (
        <GridItem key={x} xs={12} md={4} lg={3} xl={3}>
          <Skeleton height={300} variant="text" />
        </GridItem>
      ))}
    </GridContainer>
  );
}
