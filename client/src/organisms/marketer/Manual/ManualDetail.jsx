import React from 'react';
import shortid from 'shortid';
import Markdown from 'react-markdown/with-html';
// material-ui
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
// custom component
import GridContainer from '../../../atoms/Grid/GridContainer';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import CardFooter from '../../../atoms/Card/CardFooter';
import ImageDialog from './ImageDialog';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

const stepperStyles = makeStyles(theme => ({
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
}));

const useDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState();

  function handleDialogOpen() {
    setOpen(true);
  }
  function handleDialogClose() {
    setOpen(false);
  }
  function handleImageChange(src) {
    setImageSrc(src);
  }
  return {
    open, handleDialogOpen, handleDialogClose, imageSrc, handleImageChange,
  };
};

const ManualDetail = (props) => {
  const { classes, source } = props;
  const {
    open, handleDialogOpen, handleDialogClose, imageSrc, handleImageChange,
  } = useDialog();
  const stepperClasses = stepperStyles();

  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h4 className={classes.cardTitleWhite}>
            {source.card.title}
          </h4>
          <p className={classes.cardCategoryWhite}>
            {source.card.subtitle}
          </p>
        </CardHeader>
        <CardBody>
          <Stepper orientation="vertical">
            {source.source.map(value => (
              <Step active key={shortid.generate()}>
                <StepLabel>
                  <Markdown
                    source={value.description}
                    escapeHtml={false}
                    renderers={{ code: ({ value1 }) => <Markdown source={value1} /> }}
                  />
                </StepLabel>
                <StepContent>
                  {value.image && (
                  <ButtonBase
                    focusRipple
                    key={shortid.generate()}
                    className={stepperClasses.image}
                    focusVisibleClassName={classes.focusVisible}
                    onClick={() => { handleImageChange(value.image); handleDialogOpen(); }}
                  >
                    <div
                      className={stepperClasses.imageSrc}
                      style={{
                        backgroundImage: `url(${value.image})`,
                      }}
                    />
                  </ButtonBase>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardBody>

        <CardFooter stats>
          <Typography variant="body2">
            {''}
          </Typography>
          <Typography variant="subtitle2" style={{ textTransform: 'none' }}>
          이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요. E-mail : support@onad.io
          </Typography>
        </CardFooter>

      </Card>
      <ImageDialog open={open} handleDialogClose={handleDialogClose} imageSrc={imageSrc} />

    </GridContainer>
  );
};

export default withStyles(dashboardStyle)(ManualDetail);
