import React from 'react';
import shortid from 'shortid';
// core ../../../atoms
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// material-ui icons

import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';


const useButtonStyle = makeStyles(theme => ({
  fixedCard: {
    position: 'static',
    marginRight: '35px',
    height: '100%'
  },
  root: {
    background: 'white',
    borderRadius: 3,
    border: 0,
    color: 'black',
    // height: 48,
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
    classes, handleButton, activeStep,
  } = props;
  const buttonClasses = useButtonStyle();
  const doneIndex = activeStep - 1;
  const sources = ['1. 광고 유형 선택', '2. 우선 옵션 선택', '3.캠페인 기본정보 등록'];

  return (
    <div className={buttonClasses.fixedCard}>
      <Card>
        <CardHeader color="blueGray" stats>
          <h4 className={classes.cardTitleWhite}>캠페인 생성</h4>
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
                  onClick={() => handleButton(index)}
                >
                  <p>{source}</p>
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
