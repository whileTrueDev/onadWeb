import React from 'react';
// core ../../../components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
// material-ui
import broadCastingIcon from '../../../assets/img/broadcasting.svg';
import contract from '../../../assets/img/contract.svg';
import setting from '../../../assets/img/setting.svg';
import money from '../../../assets/img/money.svg';
import graph from '../../../assets/img/graph.svg';

const useButtonStyle = makeStyles({
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
});

const sources = [
  {
    icon: contract,
    label: 'OnAD 플랫폼과 계약하고 싶어요',
  },
  {
    icon: broadCastingIcon,
    label: '광고 배너를 송출하고 싶어요',
  },
  {
    icon: setting,
    label: '방송 개인 설정을 하고싶어요',
  },
  {
    icon: money,
    label: '수익금이 누적되어요',
  },
  {
    icon: graph,
    label: '출금 신청을 하고 수익데이터를 확인하고 싶어요',
  },
];

const Select = (props) => {
  const { classes, handleButton, activeStep } = props;
  const buttonClasses = useButtonStyle();
  const doneIndex = activeStep - 1;

  return (
    <Card>
      <CardHeader color="blueGray" stats>
        <h4 className={classes.cardTitleWhite}>이용 안내</h4>
        <p className={classes.cardCategoryWhite}>처음이시라면, 순서대로 진행해주세요.</p>
      </CardHeader>

      <Stepper orientation="vertical" activeStep={doneIndex}>
        { sources.map((source, index) => (
          <Step>
            <StepLabel>
              <Button
                onClick={() => handleButton(index + 1)}
                variant="outlined"
                classes={{
                  root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                  label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
                }}
              >
                <img src={source.icon} alt="" />
                <p>{source.label}</p>
              </Button>
            </StepLabel>
          </Step>
        ))}

      </Stepper>

    </Card>
  );
};

export default withStyles(dashboardStyle)(Select);
