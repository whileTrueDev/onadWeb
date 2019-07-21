import React, { useState } from 'react';

// core ../../../components
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardFooter from '../../../components/Card/CardFooter';
import c3_2 from '../../../assets/img/creatorManualImage/3_2.png';
import c3_3 from '../../../assets/img/creatorManualImage/3_3.png';
import c3_4 from '../../../assets/img/creatorManualImage/3_4.png';
import c3_5 from '../../../assets/img/creatorManualImage/3_5.png';
import c3_7 from '../../../assets/img/creatorManualImage/3_7.png';
import c3_8 from '../../../assets/img/creatorManualImage/3_8.png';
import c3_9 from '../../../assets/img/creatorManualImage/3_9.png';

import ImgModal from './ImgModal';
import ProgramSelector from './ProgramSelector';
// import scrollToComponent from 'react-scroll-to-component';

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

const ProgramSetting = (props) => {
  const { classes } = props;
  const StepperClasses = stepperStyles();

  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(false);
  const [program, setProgram] = useState(0);

  // let myDiv = React.createRef();

  const handleOpen = (imgSrc) => {
    setOpen(true);
    setSelectedImg(imgSrc);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const typeChange = (type) => {
    setProgram(type);
    console.log(type);
  };

  // const scrollTop = (event) => {
  //   myDiv.current.focus(event)
  // };

  const strongStyle = {
    fontSize: '23px',
    backgroundColor: '#FFFD95',
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <ProgramSelector
          typeChange={typeChange}
        />
      </GridItem>
      <Card>
        {program ? program === 1 ? (
          <Stepper orientation="vertical">
            <Step htmlFor="XSplit" active>
              <StepLabel>
              XSplit Broadcaster를 실행시킵니다.
              </StepLabel>
            </Step>
            <Step active>
              <StepLabel>
              하단에 있는
                <strong style={strongStyle}>추가</strong>
              를 누른 후,
                <strong style={strongStyle}>Webpage</strong>

              를 클릭합니다.
                <br />
              (참고 : XSplit 2.9 이하의 버전에서는 기타(Others) - Webpage에 있습니다.
                <br />
              되도록이면 XSplit 3.0 버전 이상으로 업그레이는 하는 것을 권장합니다.)
              </StepLabel>
              <StepContent>
                <img src={c3_2} alt="" className={StepperClasses.img} onClick={() => handleOpen(c3_2)} />
              </StepContent>
            </Step>
            <Step active>
              <StepLabel>
              복사해둔 Url을
                <strong style={strongStyle}>Ctrl + V</strong>
              를 눌러 붙여넣고,
                <strong style={strongStyle}>OK</strong>
              를 클릭합니다.
              </StepLabel>
              <StepContent>
                <img src={c3_3} alt="" className={StepperClasses.img} onClick={() => handleOpen(c3_3)} />
              </StepContent>
            </Step>
            <Step active>
              <StepLabel>
                <p>(오른쪽 이미지를 클릭하여 참고해주세요.)</p>
                <p>1) 추가된 URL을 드래그 하여 맨 위에 둡니다.</p>
                <p>2) 추가된 URL에 커서를 올리면 방송 화면에 흰 테두리가 보입니다. 드래그하여 알맞은 위치가 크기로 조절하면 됩니다.</p>
              </StepLabel>
              <StepContent>
                <img src={c3_4} alt="" className={StepperClasses.img} onClick={() => handleOpen(c3_4)} />
              </StepContent>
            </Step>
            <Step active>
              <StepLabel>
                <p>

                배너 소스를
                  <strong style={strongStyle}>오른쪽 마우스로 클릭</strong>
                합니다.
                </p>
                <p>
                  환경설정 창이 뜨면 아래에 있는
                  <strong style={strongStyle}>메모리 소스 유지</strong>
                  를 체크합니다.
                </p>
                <p>
                해상도를 설정해 두면 크기를 줄여도 비율이 그대로 유지됩니다.
                  <br />
              해상도를 설정해 두려면
                  <strong style={strongStyle}>커스텀 선택 후 800 x 480으로 지정</strong>
                하세요.
                  <br />
              (적당히 조절해 가며 원하는 숫자로 입력하면 됩니다.)
                  <br />
              모든 설정이 끝나면 창 밖을 마우스로 클릭하여 환경설정 창을 닫습니다.
                </p>
              </StepLabel>
              <StepContent>
                <img src={c3_5} alt="" className={StepperClasses.img} onClick={() => handleOpen(c3_5)} />
              </StepContent>
            </Step>
            <Step active>
              <StepLabel>

              이제 매칭된 광고가 방송화면에 나타납니다.
              </StepLabel>
            </Step>
          </Stepper>

        ) : (

          <Stepper orientation="vertical">
            <Step active>
              <StepLabel>
              OBS Studio를 실행시킵니다.
              </StepLabel>
              <StepContent />
            </Step>
            <Step active>
              <StepLabel>
              하단에 있는
                <strong style={strongStyle}>소스 목록</strong>
              에서
                <strong style={strongStyle}>+</strong>
              를 누른 후,
                <strong style={strongStyle}>BrowserSource</strong>
              를 클릭합니다.
                <br />
              (참고 : OBS Studio 19 버전 이상 사용을 권장합니다.)
              </StepLabel>
              <StepContent>
                <img src={c3_7} alt="" className={StepperClasses.img} onClick={() => handleOpen(c3_7)} />
              </StepContent>
            </Step>
            <Step active>
              <StepLabel>
              새로 만들기를 클릭하여
                <strong style={strongStyle}>확인</strong>
              을 클릭합니다.
                <br />
              (어떤 소스인지 구분하려면 BrowserSource를 Alert Box와 같이 원하는 이름으로 변경 후, 확인 버튼을 클릭하면 됩니다.)
              </StepLabel>
              <StepContent>
                <img src={c3_8} alt="" className={StepperClasses.img} onClick={() => handleOpen(c3_8)} />
              </StepContent>
            </Step>
            <Step active>
              <StepLabel>
              추가된 URL을 드래그 하여 맨 위에 둡니다. 빨간 영역을 드래그 하여 위치와 크기를 조절합니다.
              </StepLabel>
              <StepContent>
                <img src={c3_9} alt="" className={StepperClasses.img} onClick={() => handleOpen(c3_9)} />
              </StepContent>
            </Step>
            <Step active>
              <StepLabel>
            이제 매칭된 광고가 방송화면에 나타납니다.
              </StepLabel>
            </Step>
          </Stepper>

        ) : (
          <div />
        )}
        {/* <button onClick={() =>scrollToComponent('myDiv')}>맨 위로 가기</button> */}

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

export default withStyles(stepperStyles)(ProgramSetting);
