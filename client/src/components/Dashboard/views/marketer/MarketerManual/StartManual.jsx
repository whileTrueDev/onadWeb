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
import m2_1 from '../../../assets/img/MarketerManualImage/2_1.PNG';
import m2_2 from '../../../assets/img/MarketerManualImage/2_2.PNG';
import m2_3 from '../../../assets/img/MarketerManualImage/2_3.PNG';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

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
const StartManual = (props) => {
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
            배너 광고 송출
          </h4>
          <p className={classes.cardCategoryWhite}>승인된 배너광고들을 대시보드에서 송출 및 제어가 가능합니다.</p>
        </CardHeader>
        <Stepper orientation="vertical">
          <Step active>
            <StepLabel>
              {'마케터님의 대시보드로 이동합니다.'}
            </StepLabel>

          </Step>
          <Step active>
            <StepLabel>
              {'승인된 배너 이미지를 클릭하여'}
              <strong style={strongStyle}>해당 광고시작</strong>
              {'을 클릭합니다.'}
              <br />
              {'승인된 배너 이미지 클릭을 통해 개별 배너 광고의 송출과 중단이 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={m2_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(m2_1)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              <strong style={strongStyle}>현재 나의 상태</strong>
              {'에서 승인된 배너들을 일괄 제어할 수 있습니다.'}
              <br />
              <strong style={strongStyle}>ON</strong>
              {'으로 모든 광고를 개별 제어합니다.'}
              <br />
              <strong style={strongStyle}>OFF</strong>
              {'로 모든 광고송출 중단합니다.'}
            </StepLabel>
            <StepContent>
              <img src={m2_2} alt="" className={StepperClasses.img} onClick={() => handleOpen(m2_2)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'화면 하단에서 매칭된 크리에이터들을 조회 가능하며'}
              <br />
              {'각 크리에이터명을 클릭하면 정보조회가 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={m2_3} alt="" className={StepperClasses.img} onClick={() => handleOpen(m2_3)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'매칭된 크리에이터들이 방송 내에서 배너를 띄우면 마케터님의 광고가 송출되며'}
              <br />
              {'광고캐시가 차감됩니다.'}
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

export default withStyles(dashboardStyle)(StartManual);
