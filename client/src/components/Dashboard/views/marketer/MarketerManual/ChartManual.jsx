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
import ImgModal from './ImgModal'
import c1_1 from "../../../assets/img/creatorManualImage/1_1.png"

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
const ChartManual = (props) => {
  const { classes } = props;
  const StepperClasses = stepperStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedImg, setSelectedImg] = React.useState(false);

  const handleOpen = (imgSrc) => {
    setOpen(true);
    setSelectedImg(imgSrc);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h6 className={classes.cardTitleWhite}>
            광고 성과차트를 볼 수 있습니다.
          </h6>
          <p className={classes.cardCategoryWhite}>
            크리에이터가 배너 송출 시 마케터님이 보유하신 광고캐시가 차감되며 광고집행에 대한 성과차트를 보여드립니다.
          </p>
        </CardHeader>

        <h4>광고 송출 후엔 어떻게?</h4>

        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>
              매칭된 크리에어터들이 배너광고를 송출하면 10분마다 캐시가 차감됩니다.
            </StepLabel>
            <StepContent>
              <img src={c1_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_1)}/>
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              광고캐시가 소진될 때까지 크리에이터들은 마케터님의 광고를 송출합니다.
              <br />
              추후에
              <strong>
                캐시충전
              </strong>
              과
              <strong>캐시 환불</strong>
              기능 도입예정입니다.
            </StepLabel>
            <StepContent>
              <img src={c1_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_1)}/>
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              화면 하단에서 매칭된 크리에이터들의 방송을 통해 
              <br />
              마케터님의 광고의 성과차트를 확인할 수 있습니다.
            </StepLabel>
            <StepContent>
              <img src={c1_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_1)}/>
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
             마케터님의 광고를 OnAd를 통해 1인 미디어로 송출하세요!
            </StepLabel>
            <StepContent>
              <img src={c1_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_1)}/>
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

export default withStyles(stepperStyles)(ChartManual);
