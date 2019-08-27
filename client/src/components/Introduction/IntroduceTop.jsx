import React from 'react';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import { useScrollTrigger, Slide, Container } from '@material-ui/core';
import Image from './components/Image';
import Typography from '../Main/components/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[100],
  },
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sources: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  title: {
    marginTop: theme.spacing(3),
  },
}));

export default function IntroduceTop(props) {
  const { source } = props;
  const classes = useStyles();
  const [trigger, setTrigger] = React.useState(
    useScrollTrigger(
      { threshold: 300, disableHysteresis: true },
    ),
  );
  React.useEffect(() => {
    function scrollTrigger() {
      if (window.scrollY > 300) {
        setTrigger(true);
      }
    }
    scrollTrigger();
  });

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Typography className={classes.title} variant="h4">Why ONAD?</Typography>

        <Slide
          in={trigger}
          direction="right"
          timeout={{ enter: 700 }}
        >
          <div className={classes.sources}>

            {source.map(image => (
              <Image
                key={shortid.generate()}
                image={image}
              />
            ))}
          </div>

        </Slide>
      </Container>
    </section>
  );
}
