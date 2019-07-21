import React from 'react';
// core ../../../components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// icons
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
// customized components
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
// style and images
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import clip from '../../../assets/img/clip.svg';
import graph from '../../../assets/img/graph.svg';

const useButtonStyle = makeStyles({
  root: {
    background: 'white',
    borderRadius: 3,
    border: 0,
    color: 'black',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  label: {
    textTransform: 'capitalize',
    flexDirection: 'column',
  },
});

const Select = (props) => {
  const { classes, activeStep, handleButton } = props;
  const buttonClasses = useButtonStyle();
  const doneIndex = activeStep - 1;

  return (
    <Card>
      <CardHeader color="blueGray" stats>
        <h4 className={classes.cardTitleWhite}>
          이용 안내
        </h4>
        <p className={classes.cardCategoryWhite}>순서대로 진행해주세요.</p>
      </CardHeader>

      <Stepper orientation="vertical" activeStep={doneIndex}>
        <Step>
          <StepLabel />
          <CardContent>
            <Button
              size="large"
              variant="outlined"
              classes={{
                root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
              }}
              onClick={() => handleButton(1)}
            >
              <img src={clip} alt="" />

              <p>광고를 등록하고 싶어요</p>
            </Button>
          </CardContent>
        </Step>

        <Step>
          <StepLabel />
          <CardContent>
            <Button
              size="large"
              variant="outlined"
              classes={{
                root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
              }}
              onClick={() => handleButton(2)}
            >

              <BrandingWatermark />

              <p>승인된 배너를 송출하고 싶어요.</p>
            </Button>
          </CardContent>
        </Step>

        <Step>
          <StepLabel />
          <CardContent>
            <Button
              align="center"
              variant="outlined"
              classes={{
                root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
              }}
              onClick={() => handleButton(3)}
            >

              <img src={graph} alt="" />

              <p>광고 성과차트를 보고싶어요.</p>
            </Button>
          </CardContent>
        </Step>

      </Stepper>
    </Card>
  );
};

export default withStyles(dashboardStyle)(Select);
