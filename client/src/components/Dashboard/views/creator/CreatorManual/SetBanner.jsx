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
import c2_1 from '../../../assets/img/creatorManualImage/dashboard.png';
import c2_2 from '../../../assets/img/creatorManualImage/2_2.png';

import ImgModal from './ImgModal';

const stepperStyles = makeStyles(theme => ({
  root: {
    float: 'right',
  },
  img: {
    height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    width: 'auto',
    height: 'auto',
    float: 'right',
    cursor: 'pointer',
  },
}));
const SetBanner = (props) => {
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
          <h4 className={classes.cardTitleWhite}>
            광고 배너를 송출하고 싶어요.
          </h4>
          <p className={classes.cardCategoryWhite}>계약을 완료하면 크리에이터님 고유의 광고 URL을 부여합니다.</p>
        </CardHeader>

        <h4 Style="padding-left:30px">광고 URL 복사하기</h4>

        <Stepper orientation="vertical">
          <Step active>
            <StepLabel>
              화면 왼쪽 네비게이션의
              {' '}
              <strong style={strongStyle}>대시보드</strong>
              {' '}
              탭을 클릭하세요.
            </StepLabel>
            <StepContent>
              <img src={c2_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c2_1)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              배너 오버레이 URL
              <br />
              <strong style={strongStyle}>주소보기</strong>
를 클릭해주세요.
              {' '}
              <br />
              <b>+</b>
              {' '}
10초동안 주소가 보여집니다.

            </StepLabel>
            <StepContent>
              <p>주의 : Url 주소가 방송 중에 노출되지 않도록 주의해주세요.</p>
              <img src={c2_2} alt="" className={StepperClasses.img} onClick={() => handleOpen(c2_2)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              주소 오른쪽의
              {' '}
              <strong style={strongStyle}>복사</strong>
              버튼을 클릭해주세요.
              {' '}
              <br />
              이제 크리에이터님의 방송 송출 프로그램을 활성화 해주세요.
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

export default withStyles(stepperStyles)(SetBanner);
