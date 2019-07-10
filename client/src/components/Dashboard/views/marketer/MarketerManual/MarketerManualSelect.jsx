import React from 'react';
import { Link } from 'react-router-dom';
// core ../../../components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';
// material-ui
import broadCastingIcon from '../../../assets/img/broadcasting.svg';

const useButtonStyle = makeStyles({
  root: {
    background: 'white',
    borderRadius: 3,
    border: 0,
    color: 'black',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  label: {
    textTransform: 'capitalize',
    flexDirection: 'column',
  },
});

const Select = (props) => {
  const { classes, handleButton, handleButtonClose } = props;
  const buttonClasses = useButtonStyle();

  return (
    <GridContainer >
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="blueGray" stats>
            <h6 className={classes.cardTitleWhite}>
                다음의 순서대로 진행해주세요.
            </h6>
            <p className={classes.cardCategoryWhite}>다음의 순서대로 진행</p>
          </CardHeader>
          <Box
            display="flex"
            flexWrap="nowrap"
            p={1}
            m={1}
            bgcolor="background.paper"
            position="relative"
            
          >
            <Stepper>
              <Step active="true">
                <StepLabel />
                <CardContent>
                  <Button
                    size="large"
                    variant="outlined"
                    classes={{
                      root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                      label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
                    }}
                    onClick={() => handleButton(1)}
                  >

                    <img src={broadCastingIcon} alt="" />

                    <p>광고를 등록하고 싶어요</p>
                  </Button>
                </CardContent>
              </Step>

              <Step active="true">
                <StepLabel />
                <CardContent>
                  <Button
                    size="large"
                    variant="outlined"
                    classes={{
                      root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                      label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
                    }}
                    onClick={() => handleButton(2)}
                  >

                    <img src={broadCastingIcon} alt="" />

                    <p>승인된 배너를 송출하고 싶어요.</p>
                  </Button>
                </CardContent>
              </Step>
              <Step active="true">
                <StepLabel />
                <CardContent>
                  <Button
                    align="center"
                    variant="outlined"
                    classes={{
                      root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                      label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
                    }}
                    onClick={() => handleButton(3)}
                  >

                    <img src={broadCastingIcon} alt="" />

                    <p>광고 성과차트를 보고싶어요.</p>
                  </Button>
                </CardContent>
              </Step>
             
            </Stepper>
          </Box>
          <CardFooter stats />
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default withStyles(dashboardStyle)(Select);
