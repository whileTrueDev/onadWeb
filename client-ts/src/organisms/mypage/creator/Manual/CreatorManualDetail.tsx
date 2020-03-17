import React from 'react';
// core ../../../atoms
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grow from '@material-ui/core/Grow';
// custom component
import GridContainer from '../../../../atoms/Grid/GridContainer';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import CardFooter from '../../../../atoms/Card/CardFooter';
// material-ui
import ManualContent from '../../shared/ManualContent';
import ProgramSelector from './ProgramSelector';
import { ManualContentSources, Source } from '../../shared/ManualTypes';

interface ManualProgramSelectorProps {
  source: ManualContentSources;
}
function ManualProgramSelector({ source }: ManualProgramSelectorProps): JSX.Element {
  const [type, setType] = React.useState<string | null>(null);
  function handleTypeChange(programType: 'XSplit Broadcaster' | 'OBS Studio'): void {
    setType(programType);
  }

  return (
    <GridContainer>
      <Card>
        <CardHeader>
          <Typography variant="h6">
            {source.card.title}
          </Typography>
          <Typography variant="caption">
            {source.card.subtitle}
          </Typography>
        </CardHeader>
        <CardBody>
          <div>
            {source.subType ? (
              <div>
                <ProgramSelector source={source} handleTypeChange={handleTypeChange} />
                {type !== null && type === 'XSplit Broadcaster' && (
                <Grow in={type === 'XSplit Broadcaster'} timeout={{ enter: 500 }}>
                  <div>
                    <Divider />
                    <ManualContent source={source.xsplit as Source[]} />
                  </div>
                </Grow>
                )}
                {type !== null && type === 'OBS Studio' && (
                <Grow in={type === 'OBS Studio'} timeout={{ enter: 500 }}>
                  <div>
                    <Divider />
                    <ManualContent source={source.obs as Source[]} />
                  </div>
                </Grow>
                )}
              </div>
            )
              : <ManualContent source={source.source as Source[]} />}
          </div>
        </CardBody>

        <CardFooter>
          <Typography variant="body2" />
          <Typography variant="subtitle2" style={{ textTransform: 'none' }}>
            이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요. E-mail : support@onad.io
          </Typography>
        </CardFooter>

      </Card>
    </GridContainer>
  );
}

export default ManualProgramSelector;
