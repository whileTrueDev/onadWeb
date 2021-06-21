/* eslint-disable react/display-name */
import React from 'react';
import shortid from 'shortid';

import Markdown from 'react-markdown/with-html';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import CustomButton from '../../../atoms/CustomButtons/Button';

import ImageDialog from './ManualImageDialog';
import { Source } from './ManualTypes';
import useDialog from '../../../utils/hooks/useDialog';

const useStyles = makeStyles(theme => ({
  root: { marginTop: theme.spacing(3) },
  image: {
    position: 'relative',
    height: 330,
    float: 'right',
    width: '45%', // Overrides inline-style
    [theme.breakpoints.down('md')]: {
      width: '100% !important', // Overrides inline-style
      height: 200,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
    },
    cursor: 'zoom-in',
  },
  focusVisible: {},
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  guideButton: {
    padding: '5px 10px',
    marginLeft: 10,
  },
  guideLink: {
    color: 'white',
    fontFamily: 'Noto Sans kr',
    fontSize: 16,
  },
}));

interface ManualContentProps {
  source: Source[];
}
const ManualContent = ({ source }: ManualContentProps): JSX.Element => {
  const dialog = useDialog();
  const [imageSrc, setImageSrc] = React.useState<string>('');

  function handleImageChange(src: string): void {
    setImageSrc(src);
  }
  const classes = useStyles();

  return (
    <Stepper orientation="vertical" className={classes.root}>
      {source.map(value => (
        <Step active key={shortid.generate()}>
          <StepLabel>
            <Markdown
              source={value.description}
              escapeHtml={false}
              renderers={{ code: ({ value1 }: any): JSX.Element => <Markdown source={value1} /> }}
            />
            {value && value.customButton && (
              <CustomButton color="primary" size="large" className={classes.guideButton} load>
                <a
                  href="/IntroService/온애드배너제작가이드.pdf"
                  download="온애드배너제작가이드"
                  className={classes.guideLink}
                >
                  배너제작 가이드 확인하기
                </a>
              </CustomButton>
            )}
          </StepLabel>
          <StepContent>
            {value && value.image && (
              <ButtonBase
                focusRipple
                key={shortid.generate()}
                className={classes.image}
                focusVisibleClassName={classes.focusVisible}
                onClick={(): void => {
                  if (value.image) {
                    handleImageChange(value.image);
                    dialog.handleOpen();
                  }
                }}
              >
                <div
                  className={classes.imageSrc}
                  style={{
                    backgroundImage: `url(${value.image})`,
                  }}
                />
              </ButtonBase>
            )}
          </StepContent>
        </Step>
      ))}

      <ImageDialog open={dialog.open} handleDialogClose={dialog.handleClose} imageSrc={imageSrc} />
    </Stepper>
  );
};

export default ManualContent;
