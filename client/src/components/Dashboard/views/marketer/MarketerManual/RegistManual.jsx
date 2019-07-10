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
// material-ui
import broadCastingIcon from '../../../assets/img/broadcasting.svg';
import ImgModal from './ImgModal'
//images
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

  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h6 className={classes.cardTitleWhite}>
            {'광고배너 등록 - 관리하기'}
          </h6>
          <p className={classes.cardCategoryWhite}>
            {'크리에이터의 방송에 송출하고자 하는 광고를 등록하고 관리할 수 있습니다.'}
          </p>
        </CardHeader>
        <h4>배너 등록 - 관리</h4>
        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>대쉬보드에서 계약하러 가기 알림창을 클릭합니다.</StepLabel>
            <StepContent>

                <img src={c1_1} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_1)}/>

            </StepContent>

          </Step>
          <Step active="true">
            <StepLabel>
              {'먼저 자신의'}
              <strong>배너 관리</strong>
              {'탭으로 이동합니다.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} onClick={() => handleOpen(broadCastingIcon)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'화면 오른쪽에 있는'}
              <br />
              <strong>배너 등록하기</strong>
              {'에서'}
              <strong>등록</strong>
              {'을 클릭해주세요'}
              <br />
              <strong>파일찾기</strong>
              {'후'}
              <strong>업로드</strong>
              {'를 클릭해주세요.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} onClick={() => handleOpen(broadCastingIcon)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'등록한 배너는 OnAD 플랫폼의 관리자 승인을 받아야 합니다.'}
              <br />
              {'심의 진행중인 배너는'}

              <strong>X 심의취소</strong>
              {'와 삭제가 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} onClick={() => handleOpen(broadCastingIcon)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'관리자 승인이 거절된 배너는'}
              <strong>X 배너삭제</strong>
              {'를 클릭하면 삭제 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} onClick={() => handleOpen(broadCastingIcon)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'관리자 승인이 완료된 배너는'}
              <strong>광고시작</strong>
              {'을 클릭하면 광고 송출이 가능합니다.'}
              <br />
              {'마케터님의 금액 입금이 확인되면 대시보드에서 승인된 배너를 확인할 수 있습니다.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} onClick={() => handleOpen(broadCastingIcon)} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'이제 광고 송출이 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} onClick={() => handleOpen(broadCastingIcon)} />
            </StepContent>
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

export default withStyles(stepperStyles)(RegistManual);
