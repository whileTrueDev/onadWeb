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
import ImgModal from './ImgModal';
import m3_1 from '../../../assets/img/MarketerManualImage/3_1.PNG';
import m3_3 from '../../../assets/img/MarketerManualImage/3_3.PNG';
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
    float: 'right',
    cursor: 'pointer',
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
  const strongStyle = {
    fontSize: '23px',
    backgroundColor: '#FFFD95',
  };
  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h4 className={classes.cardTitleWhite}>
            광고 성과차트
          </h4>
          <p className={classes.cardCategoryWhite}>
            광고집행에 대한 성과차트를 볼 수 있습니다.
          </p>
        </CardHeader>

        <Stepper orientation="vertical">
          <Step active>
            <StepLabel>
              매칭된 크리에어터들이 배너광고를 송출하면 10분마다 캐시가 차감됩니다.
            </StepLabel>
            <StepContent>
              <img src={m3_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(m3_1)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              광고캐시가 소진될 때까지 크리에이터들은 마케터님의 광고를 송출합니다.
              <br />
              추후에
              <strong style={strongStyle}>
                캐시충전
              </strong>
              과
              <strong style={strongStyle}>캐시 환불</strong>
              기능 도입예정입니다.
            </StepLabel>
            {/* <StepContent>
              <img src={m3_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(m3_1)}/>
            </StepContent> */}
          </Step>
          <Step active>
            <StepLabel>
              화면 하단에서 매칭된 크리에이터들의 방송을 통해
              <br />
              마케터님의 광고의 성과차트를 확인할 수 있습니다.
            </StepLabel>
            <StepContent>
              <img src={m3_3} alt="" className={StepperClasses.img} onClick={() => handleOpen(m3_3)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
             마케터님의 광고를 OnAd를 통해 1인 미디어로 송출하세요!
            </StepLabel>
            {/* <StepContent>
              <img src={m3_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(m3_1)}/>
            </StepContent> */}
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

export default withStyles(dashboardStyle)(ChartManual);
