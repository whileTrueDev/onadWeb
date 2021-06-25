import { nanoid } from 'nanoid';
// core ../../../atoms
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
// material-ui icons
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import { ManualSelect } from './ManualTypes';

const useButtonStyle = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
    borderRadius: 3,
    border: 0,
    padding: '0 30px',
    boxShadow: theme.shadows[3],
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  label: {
    flexDirection: 'column',
  },
}));

interface ManualSelectorProps {
  handleButton: (num: number) => void;
  activeStep: number | null;
  sources: ManualSelect[];
}
const ManualSelector = ({
  handleButton,
  activeStep,
  sources,
}: ManualSelectorProps): JSX.Element => {
  const buttonClasses = useButtonStyle();

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6">이용 안내</Typography>
        <Typography variant="caption">처음이시라면, 순서대로 진행해주세요.</Typography>
      </CardHeader>

      <CardBody>
        <Stepper orientation="vertical" activeStep={activeStep ? activeStep - 1 : undefined}>
          {sources.map((source, index) => (
            <Step key={nanoid()}>
              <StepLabel>
                <Button
                  onClick={(): void => handleButton(index + 1)}
                  variant="outlined"
                  classes={{
                    root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                    label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
                  }}
                >
                  <source.icon style={{ marginTop: 10 }} />
                  <p>{source.label}</p>
                </Button>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardBody>
    </Card>
  );
};

export default ManualSelector;
