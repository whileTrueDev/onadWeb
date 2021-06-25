import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import ButtonBase from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import Check from '@material-ui/icons/Check';
import Success from './Typography/Success';
import OnadBanner from './Banner/OnadBanner';

const useStyles = makeStyles(theme => ({
  root: {
    width: 320,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    height: 'auto',
  },
  image: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.35,
      },
      '& $imageTitle': {
        opacity: 1.0,
      },
    },
  },
  focusVisible: {},
  imageSrc: {
    position: 'relative',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    width: '100%',
    height: 'auto',
    maxHeight: 160,
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.1,
    transition: theme.transitions.create('appear'),
  },
  imageTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
}));

const BannerCarousel = props => {
  const { steps, handleBannerId, registStep } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [checkImage, setCheckImage] = useState({ step: 0, check: 0 });
  const maxSteps = steps.length;

  useEffect(() => {
    setCheckImage({ step: 0, check: 0 });
    setActiveStep(0);
  }, [registStep]);

  function handleNext() {
    setCheckImage({});
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setCheckImage(0);
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleStepChange(step) {
    setActiveStep(step);
  }

  // check가 안될
  const handleActiveStep = step => () => {
    // check가 되어있었던 상태였다면.
    if (checkImage.check) {
      setCheckImage({ step: -1, check: 0 });
      handleBannerId('');
    } else {
      setCheckImage({ step: activeStep, check: 1 });
      handleBannerId(step.bannerId);
    }
  };

  return (
    <div className={classes.root}>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {steps.map(step => (
          <ButtonBase
            key={step.bannerId}
            className={classes.image}
            focusvisibleclassname={classes.focusVisible}
            onClick={handleActiveStep(step)}
          >
            <OnadBanner className={classes.imageSrc} src={step.bannerSrc} alt={step.bannerId} />
            <span
              className={classes.imageBackdrop}
              style={checkImage.check ? { opacity: 0.5 } : {}}
            />
            <span className={classes.imageTitle} style={checkImage.check ? { opacity: 1 } : {}}>
              <Success>
                <Check fontSize="large" />
              </Success>
            </span>
          </ButtonBase>
        ))}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </div>
  );
};

/**
 * @description
 해당 캠페인의 배너를 저장하기 위해 배너를 보여주고 체크하는 컴포넌트

 * @param {*} steps ? 배너 list가 저장된 array
 * @param {*} handleBannerId ? 배너를 등록하는 Dialog를 띄우는 state
 * @param {*} registStep ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */

export default BannerCarousel;
