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
const WithdrawalManual = (props) => {
  const { classes } = props;
  const StepperClasses = stepperStyles();

  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h6 className={classes.cardTitleWhite}>
                  계좌등록 및 출금하기
          </h6>
          <p className={classes.cardCategoryWhite}>수익금이 쌓였으니 이제 출금을 해볼까요?</p>
        </CardHeader>

        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>
              왼쪽 네비게이션에서
              {' '}
              <strong>수익관리</strong>
탭을 클릭합니다.
            </StepLabel>
            <StepContent>
              <a>
                <img src={broadCastingIcon} className={StepperClasses.img} alt="" />
              </a>
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              <strong>계좌 입력하기</strong>
알림창을 클릭하여 계좌정보를 입력합니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} className={StepperClasses.img} alt="" />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              화면 오른쪽에 있는
              {' '}
              <strong>출금신청</strong>
을 누른 후,
              <br />
              출금 가능 금액 이하의 금액을 입력합니다.
              {' '}
              <strong>진행</strong>
을 클릭합니다.
              {' '}
              <br />
              (* 출금 신청 후 계좌로 입금되기 까지 1~2일 소요됩니다.)
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} className={StepperClasses.img} alt="" />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              출금신청 내역은 다음과 같이 확인 가능합니다.
              {' '}
              <br />
              입금이 완료된 내역은
              {' '}
              <strong>완료됨v</strong>
으로 표시됩니다.
              <br />
              입금 진행 중인 내역은
              {' '}
              <strong>진행중</strong>
으로 표시됩니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} className={StepperClasses.img} alt="" />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              마지막으로 기간별 수익데이터를 확인 가능합니다.
              <br />
              <strong>범위</strong>
를 설정하여 기간별 데이터를 확인할 수 있습니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} className={StepperClasses.img} alt="" />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              이것으로 OnAD 플랫폼 이용안내를 마치겠습니다. 크리에이터님의 성장을 후원합니다.
            </StepLabel>
          </Step>
        </Stepper>
        <CardFooter>
          이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요.
        </CardFooter>
      </Card>
    </GridContainer>
  );
};

export default withStyles(stepperStyles)(WithdrawalManual);
