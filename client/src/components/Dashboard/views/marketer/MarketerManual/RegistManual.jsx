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
import ImgModal from './ImgModal';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

// images
import m1_1 from '../../../assets/img/MarketerManualImage/1_1.PNG';
import m1_2 from '../../../assets/img/MarketerManualImage/1_2.PNG';
import m1_3 from '../../../assets/img/MarketerManualImage/1_3.PNG';
import m1_4 from '../../../assets/img/MarketerManualImage/1_4.PNG';
import m1_5 from '../../../assets/img/MarketerManualImage/1_5.PNG';

const stepperStyles = makeStyles(theme => ({
  root: {
    float: 'right',
    fontSize: '15px',
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

const RegistManual = (props) => {
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
            광고배너 등록
          </h4>
          <p className={classes.cardCategoryWhite}>
            {'크리에이터의 방송에 송출하고자 하는 광고를 등록하고 관리할 수 있습니다.'}
          </p>
        </CardHeader>
        <Stepper orientation="vertical">
          <Step active>
            <StepLabel className={stepperStyles.root}>대쉬보드에서 계약하러 가기 알림창을 클릭합니다.</StepLabel>
            {/* <StepContent>
              <img src={m1_1}
              alt=""
              className={StepperClasses.img}
               onClick={() => handleOpen(m1_1)}/>
            </StepContent> */}

          </Step>
          <Step active>
            <StepLabel>
              {'먼저 자신의'}
              <strong style={strongStyle}>배너 관리</strong>
              {'탭으로 이동합니다.'}
            </StepLabel>
            <StepContent>
              <img src={m1_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(m1_1)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'화면 오른쪽에 있는'}
              <br />
              <strong style={strongStyle}>배너 등록하기</strong>
              {'에서'}
              <strong style={strongStyle}>등록</strong>
              {'을 클릭해주세요'}
              <br />
              <strong style={strongStyle}>파일찾기</strong>
              {'후'}
              <strong style={strongStyle}>업로드</strong>
              {'를 클릭해주세요.'}
            </StepLabel>
            <StepContent>
              <img src={m1_2} alt="" className={StepperClasses.img} onClick={() => handleOpen(m1_2)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'등록한 배너는 OnAD 플랫폼의 관리자 승인을 받아야 합니다.'}
              <br />
              {'심의 진행중인 배너는'}

              <strong style={strongStyle}>X 심의취소</strong>
              {'와 삭제가 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={m1_3} alt="" className={StepperClasses.img} onClick={() => handleOpen(m1_3)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'관리자 승인이 거절된 배너는'}
              <strong style={strongStyle}>X 배너삭제</strong>
              {'를 클릭하면 삭제 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={m1_4} alt="" className={StepperClasses.img} onClick={() => handleOpen(m1_4)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'관리자 승인이 완료된 배너는'}
              <strong style={strongStyle}>광고시작</strong>
              {'을 클릭하면 광고 송출이 가능합니다.'}
              <br />
              {'마케터님의 금액 입금이 확인되면 대시보드에서 승인된 배너를 확인할 수 있습니다.'}
            </StepLabel>
            <StepContent>
              <img src={m1_5} alt="" className={StepperClasses.img} onClick={() => handleOpen(m1_5)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'이제 광고 송출이 가능합니다.'}
            </StepLabel>

          </Step>
        </Stepper>
        <CardFooter>
          {'이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요.'}
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

export default withStyles(dashboardStyle)(RegistManual);
