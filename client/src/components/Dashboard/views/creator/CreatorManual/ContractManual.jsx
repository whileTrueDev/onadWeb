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
import ImgModal from './ImgModal';

import c1_1 from '../../../assets/img/creatorManualImage/1_1.png';
import c1_2 from '../../../assets/img/creatorManualImage/1_2.png';
import c1_3 from '../../../assets/img/creatorManualImage/1_3.png';

const stepperStyles = makeStyles(theme => ({
  root: {
    float: 'right',
  },
  img: {
    // height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
    height: 'auto',
    float: 'right',
    cursor: 'pointer',
  },
}));

const ContractManual = (props) => {
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
            {'OnAD 플랫폼과 계약하고 싶어요.'}
          </h4>
          <p className={classes.cardCategoryWhite}>
            OnAD 플랫폼과 계약할 수 있습니다. 서비스 이용약관과 개인정보 수집에 동의 해주세요.
          </p>
        </CardHeader>

        <Stepper orientation="vertical">
          <Step active>
            <StepLabel>대쉬보드에서 계약하러 가기 알림창을 클릭합니다.</StepLabel>
            <StepContent>
              <img
                src={c1_1}
                alt=""
                className={StepperClasses.img}
                onClick={() => handleOpen(c1_1)}
              />
            </StepContent>
            {/* <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={open}
              onClose={handleClose}
            >
              <div style={modalStyle} className={ModalClasses.paper}>
                <img src={testImg} alt="" width="100%" height="100%"/>
              </div>
            </Modal> */}


          </Step>

          <Step active>
            <StepLabel>
              {'계정 관리에 있는 서비스 이용 및 출금 계약하기의'}
              <br />
              <strong style={strongStyle}>서비스 이용약관</strong>
              {' 과 '}
              <strong style={strongStyle}>개인 정보 수집 및 동의</strong>
              {'약관보기를 클릭합니다.'}
              <br />
              <b>+</b>
              {'내용을 읽고'}
              <strong style={strongStyle}>모두 동의</strong>
              {'를 클릭합니다.'}
            </StepLabel>
            <StepContent>
              <img src={c1_2} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_2)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'모두 동의가 되면 체크박스가 2개 생깁니다.'}
              <br />
              {'마지막으로 '}
              <strong style={strongStyle}>확인</strong>
              {' 버튼을 클릭해 주세요.'}
            </StepLabel>
          </Step>
          <Step active>
            <StepLabel>
              {'완료된 계약서는 계정관리 -> 크리에이터님의 정보란의 '}
              <br />
              <strong style={strongStyle}>계약완료</strong>
              {' 를 눌러 확인 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={c1_3} alt="" className={StepperClasses.img} onClick={() => handleOpen(c1_3)} />
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>
              {'OnAD 플랫폼과 크리에이터님의 이용계약이 완료되었습니다.'}
              <br />
              {'매칭된 광고를 통해 수익을 창출해보세요. :)'}
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

export default withStyles(stepperStyles)(ContractManual);
