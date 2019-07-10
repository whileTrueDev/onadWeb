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
import broadCastingIcon from '../../../assets/img/broadcasting.svg';

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
const ProgramSetting = (props) => {
  const { classes } = props;
  const StepperClasses = stepperStyles();

  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h6 className={classes.cardTitleWhite}>
                  방송 송출 프로그램 설정
          </h6>
          <p className={classes.cardCategoryWhite}>
                  어떤 방송프로그램을 사용하시나요? OnAD는 XSplit Broadcaster와 OBS Studio를 지원합니다.
            <br />
                  사용하시는 방송 프로그램에 따라 안내해드리겠습니다.
          </p>
        </CardHeader>

        <h4>XSplit Broadcaster</h4>

        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>
              XSplit Broadcaster를 실행시킵니다.
            </StepLabel>
            <StepContent>
              
                <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
              
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              하단에 있는
              {' '}
              <strong>추가</strong>
를 누른 후,
              {' '}
              <strong>Webpage</strong>
를 클릭합니다.
              <br />
              (참고 : XSplit 2.9 이하의 버전에서는 기타(Others) - Webpage에 있습니다.
              <br />
              되도록이면 XSplit 3.0 버전 이상으로 업그레이는 하는 것을 권장합니다.)
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              복사해둔 Url을
              {' '}
              <strong>Ctrl + V</strong>
를 눌러 붙여넣고,
              {' '}
              <strong>OK</strong>
를 클릭합니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              <p>(오른쪽 이미지를 클릭하여 참고해주세요.)</p>
              <p>1) 추가된 URL을 드래그 하여 맨 위에 둡니다.</p>
              <p>2) 추가된 URL에 커서를 올리면 방송 화면에 흰 테두리가 보입니다. 드래그하여 알맞은 위치가 크기로 조절하면 됩니다.</p>
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              <p>
                  를
                {' '}
                <strong>오른쪽 마우스로 클릭</strong>
                합니다.
              </p>
              <p>
                  환경설정 창이 뜨면 아래에 있는
                {' '}
                <strong>메모리 소스 유지</strong>
                  를 체크합니다.
              </p>
              <p>
                해상도를 설정해 두면 크기를 줄여도 비율이 그대로 유지됩니다.
                <br />
              해상도를 설정해 두려면
                {' '}
                <strong>커스텀 선택 후 800 x 480으로 지정</strong>
                {' '}
                하세요.
                {' '}
                <br />
              (적당히 조절해 가며 원하는 숫자로 입력하면 됩니다.)
                {' '}
                <br />
              모든 설정이 끝나면 창 밖을 마우스로 클릭하여 환경설정 창을 닫습니다.
              </p>
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              이제 매칭된 광고가 방송화면에 나타납니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
        </Stepper>
        <h4>OBS Studio</h4>

        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>
              OBS Studio를 실행시킵니다.
            </StepLabel>
            <StepContent>
              
                <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
              
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              하단에 있는
              {' '}
              <strong>소스 목록</strong>
에서
              {' '}
              <strong>+</strong>
를 누른 후,
              {' '}
              <strong>BrowserSource</strong>
를 클릭합니다.
              <br />
              (참고 : OBS Studio 19 버전 이상 사용을 권장합니다.)
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              새로 만들기를 클릭하여
              {' '}
              <strong>확인</strong>
을 클릭합니다.
              {' '}
              <br />
              (어떤 소스인지 구분하려면 BrowserSource를 Alert Box와 같이 원하는 이름으로 변경 후, 확인 버튼을 클릭하면 됩니다.)
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              추가된 URL을 드래그 하여 맨 위에 둡니다. 빨간 영역을 드래그 하여 위치와 크기를 조절합니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
            이제 매칭된 광고가 방송화면에 나타납니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              이제 매칭된 광고가 방송화면에 나타납니다.
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
        </Stepper>
        <CardFooter>
          이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요.
        </CardFooter>
      </Card>
    </GridContainer>
  );
};

export default withStyles(stepperStyles)(ProgramSetting);
