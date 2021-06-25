import React from 'react';
// core ../../../atoms
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// custom component
import GridContainer from '../../../../atoms/Grid/GridContainer';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
// material-ui
import ManualContent from '../../shared/ManualContent_deprecated';
import { ManualContentSources, Source } from '../../shared/ManualTypes';

interface ManualProgramSelectorProps {
  source: ManualContentSources;
}
function ManualProgramSelector({ source }: ManualProgramSelectorProps): JSX.Element {
  return (
    <GridContainer>
      <Card>
        <CardHeader>
          <Typography variant="h6">{source.card.title}</Typography>
          <Typography variant="caption">{source.card.subtitle}</Typography>
        </CardHeader>
        <CardBody>
          <ManualContent source={source.source as Source[]} />
          <Divider />
          <Typography
            variant="caption"
            style={{ textTransform: 'none', float: 'right', padding: 12 }}
          >
            이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요. E-mail :
            support@onad.io
          </Typography>
        </CardBody>
      </Card>
    </GridContainer>
  );
}

export default ManualProgramSelector;
