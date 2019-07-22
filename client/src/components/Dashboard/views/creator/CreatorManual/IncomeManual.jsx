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
import c1_1 from '../../../assets/img/creatorManualImage/dashboard.png';
import c4_2 from '../../../assets/img/creatorManualImage/4_2.png';
import c4_3 from '../../../assets/img/creatorManualImage/4_3.png';

const stepperStyles = makeStyles(theme => ({
  root: {
    float: 'right',
  },
  img: {
    // height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    width: 'auto',
    height: 'auto',
    float: 'right',
    cursor: 'pointer',
  },
}));
const IncomeManual = (props) => {
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
                  수익금이 쌓입니다.
          </h4>
          <p className={classes.cardCategoryWhite}>
            방송송출 프로그램에 고유 URL을 붙여넣기해서 광고를 송출하면 자동적으로 수익금이 쌓입니다.
          </p>
        </CardHeader>

        <h4>수익금 확인하기</h4>

        <Stepper orientation="vertical">
          <Step active>
            <StepLabel>
              자신의
              {' '}
              <strong style={strongStyle}>대시보드</strong>
              로 이동합니다.
            </StepLabel>
            <StepContent>
              <img src={c1_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_1)} />

            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              광고가 매칭되면 자동적으로 배너이미지가 뜹니다.
              {' '}
              <br />
              아쉽게도 아직 매칭되지 않았다면, 빈화면이 유지됩니다..
            </StepLabel>
            <StepContent>
              <img src={c4_2} alt="" className={StepperClasses.img} onClick={() => handleOpen(c4_2)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              광고가 매칭된 상태에서 방송하게 되면 대시보드의
              {' '}
              <strong style={strongStyle}>수익금</strong>
에서
              {' '}
              <br />
              10분마다 누적되는 수익금을 확인할 수 있습니다.
            </StepLabel>
            <StepContent>
              <img src={c4_3} alt="" className={StepperClasses.img} onClick={() => handleOpen(c4_3)} />
            </StepContent>
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

export default withStyles(stepperStyles)(IncomeManual);
