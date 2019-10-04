import React from 'react';
import shortid from 'shortid';
// core ../../../atoms
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// customized components
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
// style and images
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

const useButtonStyle = makeStyles(theme => ({
  fixedCard: {
    position: 'static',
  },
  root: {
    background: 'white',
    borderRadius: 3,
    border: 0,
    color: 'black',
    padding: '0 30px',
    boxShadow: '0 3px 3px 2px rgba(102, 102, 102, .3)',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  label: {
    textTransform: 'capitalize',
    flexDirection: 'column',
  },
}));

const Select = (props) => {
  const {
    classes, activeStep, handleButton, sources,
  } = props;
  const buttonClasses = useButtonStyle();
  const doneIndex = activeStep - 1;

  return (
    <div className={buttonClasses.fixedCard}>
      <Card>
        <CardHeader color="blueGray" stats>
          <h4 className={classes.cardTitleWhite}>
          이용 안내
          </h4>
          <p className={classes.cardCategoryWhite}>처음이시라면, 순서대로 진행해주세요.</p>
        </CardHeader>

        <Stepper orientation="vertical" activeStep={doneIndex}>
          {sources.map((source, index) => (
            <Step key={shortid.generate()}>
              <StepLabel>

                <Button
                  size="large"
                  variant="outlined"
                  classes={{
                    root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                    label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
                  }}
                  onClick={() => handleButton(index + 1)}
                >
                  <source.icon style={{ marginTop: 10 }} />
                  <p>{source.label}</p>
                </Button>
              </StepLabel>
            </Step>
          ))}

        </Stepper>

      </Card>
    </div>
  );
};

export default withStyles(dashboardStyle)(Select);
