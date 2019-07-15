import React from 'react';

// core ../../../components
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardFooter from '../../../components/Card/CardFooter';
// material-ui

//
import broadCastingIcon from '../../../assets/img/broadcasting.svg';

const stepperStyles = makeStyles(theme => ({
  root: {
    float: 'right',
  },
  img: {
    height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
    float: 'right',
  },
}));
const IncomeManual = (props) => {
  const { classes } = props;
  const StepperClasses = stepperStyles();

  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h6 className={classes.cardTitleWhite}>
                  수익금이 쌓입니다.
          </h6>
          <p className={classes.cardCategoryWhite}>
            방송송출 프로글매에 고유 URL을 붙여넣기해서 광고를 송출하면 자동적으로 수익금이 쌓입니다.
          </p>
        </CardHeader>

        <h4>수익금 확인하기</h4>

        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>
              자신의
              {' '}
              <strong>대시보드</strong>
로 이동합니다.
            </StepLabel>
            <StepContent>

              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />

            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              광고가 매칭되면 자동적으로 배너이미지가 뜹니다.
              {' '}
              <br />
              아쉽게도 아직 매칭되지 않았다면, 빈화면이 유지됩니다..
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              광고가 매칭된 상태에서 방송하게 되면 대시보드의
              {' '}
              <strong>수익금</strong>
에서
              {' '}
              <br />
              10분마다 누적되는 수익금을 확인할 수 있습니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
        </Stepper>

        <CardFooter>
          이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요.
        </CardFooter>
      </Card>
    </GridContainer>
  );
};

export default withStyles(stepperStyles)(IncomeManual);
