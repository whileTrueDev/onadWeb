import React, { useState } from 'react';

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
import ImgModal from './ImgModal';
// images
import c5_1 from '../../../assets/img/creatorManualImage/5_1.png';
import c5_2 from '../../../assets/img/creatorManualImage/5_2.png';
import c5_3 from '../../../assets/img/creatorManualImage/5_3.png';
import c5_4 from '../../../assets/img/creatorManualImage/5_4.png';
import c5_5 from '../../../assets/img/creatorManualImage/5_5.png';


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

  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(false);

  const handleOpen = (imgSrc) => {
    setOpen(true);
    setSelectedImg(imgSrc);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const strongStyle = {
    fontSize: '23px',
    backgroundColor: '#FFFD95',
  };
  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h6 className={classes.cardTitleWhite}>
            계좌등록 및 출금하기
          </h6>
          <p className={classes.cardCategoryWhite}>언제나 짜릿하고 늘 새로운 출금 시간입니다.</p>
        </CardHeader>

        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>
              왼쪽 네비게이션에서
              {' '}
              <strong style={strongStyle}>수익관리</strong>
              탭을 클릭합니다.
            </StepLabel>
            <StepContent>
              <img src={c5_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c5_1)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              <strong style={strongStyle}>계좌 입력하기</strong>
              알림창을 클릭하여 계좌정보를 입력합니다.
            </StepLabel>
            <StepContent>
              <img src={c5_2} alt="" className={StepperClasses.img} onClick={() => handleOpen(c5_2)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              화면 오른쪽에 있는
              {' '}
              <strong style={strongStyle}>출금신청</strong>
              을 누른 후,
              <br />
              출금 가능 금액 이하의 금액을 입력합니다.
              {' '}
              <strong style={strongStyle}>진행</strong>
              을 클릭합니다.
              {' '}
              <br />
              (* 출금 신청 후 계좌로 입금되기 까지 1~2일 소요됩니다.)
            </StepLabel>
            <StepContent>
              <img src={c5_3} alt="" className={StepperClasses.img} onClick={() => handleOpen(c5_3)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              출금신청 내역은 다음과 같이 확인 가능합니다.
              {' '}
              <br />
              입금이 완료된 내역은
              {' '}
              <strong style={strongStyle}>완료됨</strong>
              으로 표시됩니다.
              <br />
              입금 진행 중인 내역은
              {' '}
              <strong style={strongStyle}>진행중</strong>
              으로 표시됩니다.
            </StepLabel>
            <StepContent>
              <img src={c5_4} alt="" className={StepperClasses.img} onClick={() => handleOpen(c5_4)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              마지막으로 기간별 수익데이터를 확인 가능합니다.
              <br />
              <strong style={strongStyle}>범위</strong>
              를 설정하여 기간별 데이터를 확인할 수 있습니다.
            </StepLabel>
            <StepContent>
              <img src={c5_5} alt="" className={StepperClasses.img} onClick={() => handleOpen(c5_5)} />
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
      <ImgModal
        openModal={open}
        handleClose={handleClose}
        ImgSrc={selectedImg}
      />
    </GridContainer>
  );
};

export default withStyles(stepperStyles)(WithdrawalManual);
